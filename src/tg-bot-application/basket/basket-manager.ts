import { Basket } from '../../domain/shop/domain/basket/basket';
import { Product, ProductId } from '../../domain/common/product/domain/product/product';
import { UserId } from '../../domain/common/user/domain/user/user-id';
import { Count } from '../../domain/common/types/count';
import { IBasketManager } from './i-basket-manager';
import { AddItemToBasket } from '../../domain/shop/usecase/basket/add-item-to-basket';
import { RemoveItemFromBasket } from '../../domain/shop/usecase/basket/remove-item-from-basket';
import { GetProductById } from '../../domain/shop/usecase/product/get-product-by-id';
import { UserName, UserTgId } from '../../domain/common/user/domain/user/user';
import { GetOrCreateUser } from '../../domain/common/user/usecase/user/get-or-create-user';
import { GetOrCreateUserBasket } from '../../domain/shop/usecase/basket/get-or-create-user-basket';
import { ClearBasket } from '../../domain/shop/usecase/basket/clear-basket';

export class BasketManager implements IBasketManager {
  constructor(
    private readonly addItemToBasketUseCase: AddItemToBasket,
    private readonly removeItemFromBasketUseCase: RemoveItemFromBasket,
    private readonly getProductByIdUseCase: GetProductById,
    private readonly getOrCreateUserUseCase: GetOrCreateUser,
    private readonly getOrCreateUserBasketUseCase: GetOrCreateUserBasket,
    private readonly clearBasketUseCase: ClearBasket,
  ) {}

  async addItemToBasket(userTgId: UserTgId, username: UserName, productId: ProductId): Promise<Basket> {
    const user = await this.getOrCreateUserUseCase.execute(userTgId, username);
    await this.getOrCreateUserBasketUseCase.execute(user.id);
    return this.addItemToBasketUseCase.execute(productId, 1, user.id);
  }

  async removeItemFromBasket(productId: ProductId, count: Count, userId: UserId): Promise<Basket> {
    return this.removeItemFromBasketUseCase.execute(productId, count, userId);
  }

  async getBasketProducts(userTgId: UserTgId, username: UserName): Promise<Array<Product & { count: Count }>> {
    const user = await this.getOrCreateUserUseCase.execute(userTgId, username);
    const basket = await this.getOrCreateUserBasketUseCase.execute(user.id);
    const itemIds: Array<{ id: ProductId; count: Count }> = [];
    basket.items.forEach((count, id) => itemIds.push({ id, count }));
    const fetchItem = async ({ id, count }: { id: ProductId; count: Count }) => {
      const item = await this.getProductByIdUseCase.execute(id);
      if (!item) {
        return undefined;
      }
      return {
        ...item,
        count,
      }
    };
    const items = (await Promise.all(itemIds.map(fetchItem))).filter(p => p);
    return items as Array<Product & { count: Count }>;
  }

  async clearBasket(userTgId: UserTgId, username: UserName) {
    const user = await this.getOrCreateUserUseCase.execute(userTgId, username);
    const basket = await this.getOrCreateUserBasketUseCase.execute(user.id);
    await this.clearBasketUseCase.execute(basket.id);
  }
}
