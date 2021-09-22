import { BasketId } from '../../domain/basket/basket';
import { Order } from '../../domain/order/order';

export interface CreateOrderFromBasket {
  execute(basketId: BasketId): Promise<Order>;
}
