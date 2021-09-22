import { Order } from '../../domain/order/order';

export interface OrderPersister {
  save(order: Order): Promise<Order>;
}
