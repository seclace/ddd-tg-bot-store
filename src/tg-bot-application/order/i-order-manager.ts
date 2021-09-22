import { Order } from '../../domain/shop/domain/order/order';
import { UserName, UserTgId } from '../../domain/common/user/domain/user/user';

export interface IOrderManager {
  makeOrder(userTgId: UserTgId, username: UserName): Promise<Order>;
  payOrder(userTgId: UserTgId, username: UserName): Promise<Order>;
}
