import { Order } from '../../domain/shop/domain/order/order';
import { IOrderManager } from './i-order-manager';
import { CreateOrderFromBasket } from '../../domain/shop/usecase/order/create-order-from-basket';
import { PayOrder } from '../../domain/shop/usecase/order/pay-order';
import { UserName, UserTgId } from '../../domain/common/user/domain/user/user';
import { GetOrCreateUser } from '../../domain/common/user/usecase/user/get-or-create-user';
import { GetOrCreateUserBasket } from '../../domain/shop/usecase/basket/get-or-create-user-basket';
import { GetUserOrder } from '../../domain/shop/usecase/order/get-user-order';
import { Product, ProductId } from '../../domain/common/product/domain/product/product';
import { Count } from '../../domain/common/types/count';
import { GetProductById } from '../../domain/shop/usecase/product/get-product-by-id';

export class OrderManager implements IOrderManager {
  constructor(
    private readonly createOrderFromBasketUseCase: CreateOrderFromBasket,
    private readonly payOrderUseCase: PayOrder,
    private readonly getOrCreateUserUseCase: GetOrCreateUser,
    private readonly getOrCreateUserBasketUseCase: GetOrCreateUserBasket,
    private readonly getUserOrderUseCase: GetUserOrder,
    private readonly getProductByIdUseCase: GetProductById,
  ) {}

  async makeOrder(userTgId: UserTgId, username: UserName): Promise<Order> {
    const user = await this.getOrCreateUserUseCase.execute(userTgId, username);
    const basket = await this.getOrCreateUserBasketUseCase.execute(user.id);
    const order = await this.createOrderFromBasketUseCase.execute(basket.id);
    return order;
  }

  async payOrder(userTgId: UserTgId, username: UserName): Promise<Order> {
    const user = await this.getOrCreateUserUseCase.execute(userTgId, username);
    const order = await this.getUserOrderUseCase.execute(user.id);
    return this.payOrderUseCase.execute(order.id);
  }

  async getOrderProducts(userTgId: UserTgId, username: UserName): Promise<Array<Product & { count: Count }>> {
    const user = await this.getOrCreateUserUseCase.execute(userTgId, username);
    const order = await this.getUserOrderUseCase.execute(user.id);
    const itemIds: Array<{ id: ProductId; count: Count }> = [];
    order.items.forEach((count, id) => itemIds.push({ id, count }));
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
}
