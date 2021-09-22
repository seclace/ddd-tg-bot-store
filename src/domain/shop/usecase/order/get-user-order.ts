import { Order } from '../../domain/order/order';
import { UserId } from '../../../common/user/domain/user/user-id';

export interface GetUserOrder {
  execute(userId: UserId): Promise<Order>;
}
