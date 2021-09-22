import { Order, OrderId } from '../../domain/order/order';
import { UserId } from '../../../common/user/domain/user/user-id';

export interface OrderExtractor {
  getOneById(orderId: OrderId): Promise<Order | undefined>;
  getOneByUserId(userId: UserId): Promise<Order | undefined>;
}
