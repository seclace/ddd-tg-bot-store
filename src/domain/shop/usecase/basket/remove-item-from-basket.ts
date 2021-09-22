import { UserId } from '../../../common/user/domain/user/user-id';
import { Basket } from '../../domain/basket/basket';
import { Count } from '../../../common/types/count';
import { ProductId } from '../../../common/product/domain/product/product';

export interface RemoveItemFromBasket {
  execute(productId: ProductId, count: Count, forUser: UserId): Promise<Basket>;
}
