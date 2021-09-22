import { BasketPersister } from '../../usecase/basket/basket-persister';
import { BasketExtractor } from '../../usecase/basket/basket-extractor';
import { Basket, BasketId } from '../../domain/basket/basket';
import { UserId } from '../../../common/user/domain/user/user-id';
import { EventPublisher } from '../../../common/types/domain-event';
import { knex } from '../../../../db/knex';
import { T_BASKET_PRODUCTS, T_BASKETS, T_PRODUCTS } from '../../../../db/constants';
import { ProductId } from '../../../common/product/domain/product/product';
import { Count } from '../../../common/types/count';

const basketColumns = [
  'id',
  'userId',
];
const basketProductsColumns = [
  'count',
  'productId',
];

export class PsqlBasketRepository implements BasketPersister, BasketExtractor {
  constructor(
    private readonly eventPublisher: EventPublisher,
  ) {}

  async getOneById(basketId: BasketId): Promise<Basket | undefined> {
    const entry = await knex(T_BASKETS).select(basketColumns).where('id', basketId).first();
    if (!entry) {
      return undefined;
    }
    const products = await knex(T_BASKET_PRODUCTS)
      .select(basketProductsColumns)
      .where('basketId', basketId);
    const productsMap = new Map<ProductId, Count>();
    products.map(({ count, productId }) => productsMap.set(productId, count));

    return Basket.from(entry.id, productsMap, entry.userId);
  }

  async getOneByUserId(userId: UserId): Promise<Basket | undefined> {
    const entry = await knex(T_BASKETS).select(basketColumns).where('userId', userId).first();
    if (!entry) {
      return undefined;
    }
    const products = await knex(T_BASKET_PRODUCTS)
      .select(basketProductsColumns)
      .where('basketId', entry.id);
    const productsMap = new Map<ProductId, Count>();
    products.map(({ count, productId }) => productsMap.set(productId, count));

    return Basket.from(entry.id, productsMap, entry.userId);
  }

  async save(basket: Basket): Promise<Basket> {
    if (basket.id === -1) {
      const [id] = await knex(T_BASKETS).insert({ userId: basket.userId }).returning('id');
      basket.setIdAfterCreate(id);
    } else {
      await knex(T_BASKET_PRODUCTS)
        .select(basketProductsColumns)
        .where('basketId', basket.id)
        .delete();
      const items = await knex(T_BASKET_PRODUCTS)
          .select(basketProductsColumns)
          .where('basketId', basket.id);
      console.log('PsqlBasketRepository.save()')
      console.log({ items })
      const entries: Array<{ count: Count; productId: ProductId; basketId: BasketId }> = [];
      basket.items.forEach((count, productId) => entries.push({ count, productId, basketId: basket.id }));
      if (entries.length > 0) {
        await knex(T_BASKET_PRODUCTS).insert(entries);
      }
    }

    const events = basket.popEvents();
    await this.eventPublisher.publish(events);

    return basket;
  }
}
