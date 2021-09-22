import { BasketId } from '../../domain/basket/basket';
import { Order } from '../../domain/order/order';
import { CreateOrderFromBasket } from './create-order-from-basket';
import { BasketExtractor } from '../basket/basket-extractor';
import { OrderPersister } from './order-persister';
import { BasketNotFoundError } from '../../domain/basket/errors/basket-not-found.error';

export class CreateOrderFromBasketUseCase implements CreateOrderFromBasket {
  constructor(
    private readonly basketExtractor: BasketExtractor,
    private readonly orderPersister: OrderPersister,
  ) {}

  async execute(basketId: BasketId): Promise<Order> {
    const basket = await this.basketExtractor.getOneById(basketId);
    if (!basket) {
      throw new BasketNotFoundError();
    }

    const orderItems = basket.items;
    let order = Order.create(basket.userId, orderItems);
    order = await this.orderPersister.save(order);

    return order;
  }
}
