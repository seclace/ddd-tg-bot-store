import { UserId } from '../../../common/user/domain/user/user-id';
import { Basket } from '../../domain/basket/basket';
import { GetOrCreateUserBasket } from './get-or-create-user-basket';
import { BasketExtractor } from './basket-extractor';
import { BasketPersister } from './basket-persister';

export class GetOrCreateUserBasketUseCase implements GetOrCreateUserBasket {
  constructor(
    private readonly basketExtractor: BasketExtractor,
    private readonly basketPersister: BasketPersister,
  ) {}

  async execute(userId: UserId): Promise<Basket> {
    const mayBeBasket = await this.basketExtractor.getOneByUserId(userId);
    if (mayBeBasket) {
      return mayBeBasket;
    }

    const basket = Basket.create(userId);
    return this.basketPersister.save(basket);
  }
}
