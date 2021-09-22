import { UserId } from '../../../common/user/domain/user/user-id';
import { Basket } from '../../domain/basket/basket';
import { Count } from '../../../common/types/count';
import { RemoveItemFromBasket } from './remove-item-from-basket';
import { BasketExtractor } from './basket-extractor';
import { BasketPersister } from './basket-persister';
import { BasketNotFoundError } from '../../domain/basket/errors/basket-not-found.error';
import { ProductId } from '../../../common/product/domain/product/product';

export class RemoveItemFromBasketUseCase implements RemoveItemFromBasket {
  constructor(
    private readonly basketExtractor: BasketExtractor,
    private readonly basketPersister: BasketPersister,
  ) {}

  async execute(productId: ProductId, count: Count, forUser: UserId): Promise<Basket> {
    const basket = await this.basketExtractor.getOneByUserId(forUser);
    if (!basket) {
      throw new BasketNotFoundError();
    }

    basket.removeItem(productId, count);
    await this.basketPersister.save(basket);

    return basket;
  }
}
