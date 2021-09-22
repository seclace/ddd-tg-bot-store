import { Basket, BasketId } from '../../domain/basket/basket';
import { ClearBasket } from './clear-basket';
import { BasketExtractor } from './basket-extractor';
import { BasketPersister } from './basket-persister';
import { BasketNotFoundError } from '../../domain/basket/errors/basket-not-found.error';

export class ClearBasketUseCase implements ClearBasket {
  constructor(
    private readonly basketExtractor: BasketExtractor,
    private readonly basketPersister: BasketPersister,
  ) {}

  async execute(id: BasketId): Promise<Basket> {
    const basket = await this.basketExtractor.getOneById(id);
    if (!basket) {
      throw new BasketNotFoundError();
    }

    basket.clear();
    return await this.basketPersister.save(basket);
  }
}
