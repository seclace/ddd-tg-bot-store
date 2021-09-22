import { Basket, BasketId } from '../../domain/basket/basket';
import { UserId } from '../../../common/user/domain/user/user-id';

export interface BasketExtractor {
  getOneById(basketId: BasketId): Promise<Basket | undefined>;
  getOneByUserId(userId: UserId): Promise<Basket | undefined>;
}
