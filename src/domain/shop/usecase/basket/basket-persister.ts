import { Basket } from '../../domain/basket/basket';

export interface BasketPersister {
  save(basket: Basket): Promise<Basket>;
}
