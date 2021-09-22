import { Order, OrderId } from '../../domain/order/order';
import { PayOrder } from './pay-order';
import { OrderExtractor } from './order-extractor';
import { OrderPersister } from './order-persister';
import { OrderNotFoundError } from '../../domain/order/errors/order-not-found.error';

export class PayOrderUseCase implements PayOrder {
  constructor(
    private readonly orderExtractor: OrderExtractor,
    private readonly orderPersister: OrderPersister,
  ) {}

  async execute(orderId: OrderId): Promise<Order> {
    let order = await this.orderExtractor.getOneById(orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }

    order.pay();
    order = await this.orderPersister.save(order);

    return order;
  }
}
