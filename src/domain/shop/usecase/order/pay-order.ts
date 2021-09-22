import { Order, OrderId } from '../../domain/order/order';

export interface PayOrder {
  execute(orderId: OrderId): Promise<Order>;
}
