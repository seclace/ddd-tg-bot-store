import { UserId } from '../../../common/user/domain/user/user-id';
import { Basket } from '../../domain/basket/basket';
import { Count } from '../../../common/types/count';
import { AddItemToBasket } from './add-item-to-basket';
import { BasketExtractor } from './basket-extractor';
import { BasketNotFoundError } from '../../domain/basket/errors/basket-not-found.error';
import { BasketPersister } from './basket-persister';
import { ProductId } from '../../../common/product/domain/product/product';

export class AddItemToBasketUseCase implements AddItemToBasket {
  constructor(
    private readonly basketExtractor: BasketExtractor,
    private readonly basketPersister: BasketPersister,
  ) {}

  async execute(productId: ProductId, count: Count, forUser: UserId): Promise<Basket> {
    const basket = await this.basketExtractor.getOneByUserId(forUser);
    if (!basket) {
      throw new BasketNotFoundError();
    }

    basket.addItem(productId, count);
    await this.basketPersister.save(basket);

    return basket;
  }
}
