import { Order } from '../../domain/order/order';
import { UserId } from '../../../common/user/domain/user/user-id';
import { GetUserOrder } from './get-user-order';
import { OrderExtractor } from './order-extractor';
import { OrderNotFoundError } from '../../domain/order/errors/order-not-found.error';

export class GetUserOrderUseCase implements GetUserOrder {
  constructor(
    private readonly orderExtractor: OrderExtractor,
  ) {}

  async execute(userId: UserId): Promise<Order> {
    const order = await this.orderExtractor.getOneByUserId(userId);
    if (!order) {
      throw new OrderNotFoundError();
    }
    return order;
  }
}
