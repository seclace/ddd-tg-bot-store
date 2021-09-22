import { Basket } from '../../domain/shop/domain/basket/basket';
import { Product, ProductId } from '../../domain/common/product/domain/product/product';
import { UserId } from '../../domain/common/user/domain/user/user-id';
import { Count } from '../../domain/common/types/count';
import { UserName, UserTgId } from '../../domain/common/user/domain/user/user';

export interface IBasketManager {
  addItemToBasket(userTgId: UserTgId, username: UserName, productId: ProductId): Promise<Basket>;
  removeItemFromBasket(productId: ProductId, count: Count, userId: UserId): Promise<Basket>;
  getBasketProducts(userTgId: UserTgId, username: UserName): Promise<Array<Product & { count: Count }>>;
}
