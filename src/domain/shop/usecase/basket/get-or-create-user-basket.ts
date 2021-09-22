import { UserId } from '../../../common/user/domain/user/user-id';
import { Basket } from '../../domain/basket/basket';

export interface GetOrCreateUserBasket {
  execute(userId: UserId): Promise<Basket>;
}
