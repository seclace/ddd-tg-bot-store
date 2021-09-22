import TelegramBot from 'node-telegram-bot-api';
import { initializeDependencies } from './common/initialize-dependencies';
import { Product } from '../domain/common/product/domain/product/product';
import { Count } from '../domain/common/types/count';
import { UserName, UserTgId } from '../domain/common/user/domain/user/user';
import { InputToCommand } from './common/utils/input-to-command';
import { Order } from '../domain/shop/domain/order/order';

const MARKUPS = {
  defaultStart: () => ({
    keyboard: [[ { text: 'Показать корзину' }, { text: 'Оформить заказ' } ]],
    resize_keyboard: true
  }),
  makeOrder: () => ({ inline_keyboard: [[{ text: 'Оформить заказ', callback_data: '/makeorder' }]] }),
  payOrder: () => ({ inline_keyboard: [[{ text: 'Оплатить заказ', callback_data: '/payorder' }]] }),
  publisher: (productId?: number) => ({
    inline_keyboard: [[
      { text: 'Купить', callback_data: `/purchase/${productId}` },
      { text: 'В корзину', callback_data: '/basket', url: 't.me/NewOneAliexpressBot?start=getbasket' },
    ]],
  }),
};

export class TgBotApplication {
  private deps = initializeDependencies();
  private bot: TelegramBot;

  constructor(private token: string, private channelId: string) {
    if (!token) {
      throw new Error('please, provide TG_BOT_TOKEN');
    }
    if (!channelId) {
      throw new Error('please, provide TG_CHANNEL_ID');
    }

    this.bot = new TelegramBot(token, { polling: true });
  }

  async initialize() {
    await this.setBotListeners();
    await this.startPublisher();
  }

  private async setBotListeners() {
    const {
      productManager,
      basketManager,
      orderManager,
    } = this.deps;

    const getItemsTotal = async (items: Array<Product & { count: Count }>) => {
      let itemsTotalText = items.map(({ name, price, count }, i) => `${i + 1}. ${name}: $${price} * ${count}`).join('\n');
      const totalSum = items.reduce((sum, { count, price }) => (sum || 0) + count * price, 0);
      itemsTotalText += `\n\nИтого: $${totalSum}`;
      return { itemsTotalText, totalSum };
    };

    const showBasket = async (chatId: string | number, userTgId?: UserTgId, username?: UserName) => {
      if (!userTgId || !username) {
        return;
      }
      const items = await basketManager.getBasketProducts(userTgId, username);
      const { itemsTotalText } = await getItemsTotal(items);
      const response = `Товары в вашей корзине:\n\n${itemsTotalText}`;
      await this.bot.sendMessage(chatId, response, { reply_markup: MARKUPS.makeOrder() });
    };

    const showOrder = async (chatId: string | number, userTgId?: UserTgId, username?: UserName) => {
      if (!userTgId || !username) {
        return;
      }
      const items = await orderManager.getOrderProducts(userTgId, username);
      const { totalSum, itemsTotalText } = await getItemsTotal(items);
      const response = `Заказ на сумму $${totalSum} оформлен\n\nТовары:\n\n${itemsTotalText}`;
      await this.bot.sendMessage(chatId, response, { reply_markup: MARKUPS.payOrder() });
      await basketManager.clearBasket(userTgId, username);
    };

    const finishOrder = async (chatId: string | number) => {
      await this.bot.sendMessage(chatId, 'Ваш заказ оплачен!');
    };

    this.bot.on('callback_query', async ({ data, message, from, id }) => {
      const inputToCommand = new InputToCommand(data);
      let order: Order;
      const chatId = message?.chat.id as number;
      const userTgId = from.id;
      const username = from.username || from.first_name;
      console.log('inputToCommand.getCommand():', inputToCommand.getCommand())
      switch (inputToCommand.getCommand()) {
        case 'getbasket':
          console.log('go to basket for user:', from.id)
          await this.bot.answerCallbackQuery(id, {
            callback_query_id: id,
            url: 't.me/NewOneAliexpressBot?start=getbasket',
          });
          break;
        case 'makeorder':
          order = await orderManager.makeOrder(userTgId, username);
          console.log({ order });
          await showOrder(chatId, userTgId, username);
          break;
        case 'payorder':
          order = await orderManager.payOrder(userTgId, username);
          console.log({ order });
          await finishOrder(chatId);
          break;
        case 'purchase':
          const [, productId] = (data || '').match(/\/purchase\/(.*)/) || [];
          const basket = await basketManager.addItemToBasket(userTgId, username, +productId);
          console.log({ basket });
          break;
        default:
          break;
      }
    });

    this.bot.onText(/\/start\s(.*)/, async (msg, match) => {
      console.log({ msg, match })
      if (match && match[1] === 'getbasket') {
        const userTgId = msg.from?.id;
        const username = msg.from?.username;
        if (!userTgId || !username) {
          return;
        }
        return await showBasket(msg.chat.id, userTgId, username);
      }

      await this.bot.sendMessage(msg.chat.id, 'Выберите действие ниже:', {
        reply_markup: MARKUPS.defaultStart(),
      });
    });

    this.bot.onText(/Показать корзину/, async (msg) => {
      const userTgId = msg.from?.id;
      const username = msg.from?.username;
      if (!userTgId || !username) {
        return;
      }
      await showBasket(msg.chat.id, userTgId, username);
    });
    this.bot.onText(/Оформить заказ/, (msg) => {});
  }

  private async startPublisher() {
    const { productManager } = this.deps;
    const publishRandomProduct = async () => {
      const product = await productManager.getRandomProduct();
      await this.bot.sendPhoto(this.channelId, product.photo, {
        caption: `${product.name}: $${product.price}`,
        reply_markup: MARKUPS.publisher(product?.id),
      });
    };
    await publishRandomProduct();
    const interval = setInterval(publishRandomProduct, 10000);
    // setTimeout(() => clearInterval(interval), 15000);
  }
}
