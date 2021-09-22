import { Basket, BasketId } from '../../domain/basket/basket';

export interface ClearBasket {
  execute(id: BasketId): Promise<Basket>;
}
