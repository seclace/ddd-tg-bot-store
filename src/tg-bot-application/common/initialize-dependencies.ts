import { BotEventPublisher } from './bot-event-publisher';
import { CreateProductUseCase } from '../../domain/admin/usecase/product/create-product.use-case';
import { PsqlProductRepository } from '../../domain/common/product/persistence/product/psql-product-repository';
import { PsqlOrderRepository } from '../../domain/shop/persistence/order/psql-order-repository';
import { PsqlBasketRepository } from '../../domain/shop/persistence/basket/psql-basket-repository';
import { AddItemToBasketUseCase } from '../../domain/shop/usecase/basket/add-item-to-basket.use-case';
import { RemoveItemFromBasketUseCase } from '../../domain/shop/usecase/basket/remove-item-from-basket.use-case';
import { CreateOrderFromBasketUseCase } from '../../domain/shop/usecase/order/create-order-from-basket.use-case';
import { PayOrderUseCase } from '../../domain/shop/usecase/order/pay-order.use-case';
import { GetRandomProductUseCase } from '../../domain/shop/usecase/product/get-random-product.use-case';
import { BasketManager } from '../basket/basket-manager';
import { OrderManager } from '../order/order-manager';
import { ProductManager } from '../product/product-manager';
import { PsqlUserRepository } from '../../domain/common/user/persistence/user/psql-user-repository';
import { GetOrCreateUserUseCase } from '../../domain/common/user/usecase/user/get-or-create-user.use-case';
import { GetOrCreateUserBasketUseCase } from '../../domain/shop/usecase/basket/get-or-create-user-basket.use-case';
import { ClearBasketUseCase } from '../../domain/shop/usecase/basket/clear-basket.use-case';
import { GetProductByIdUseCase } from '../../domain/shop/usecase/product/get-product-by-id.use-case';
import { GetUserOrderUseCase } from '../../domain/shop/usecase/order/get-user-order.use-case';

export function initializeDependencies() {
  const eventPublisher = new BotEventPublisher();
  const productRepo = new PsqlProductRepository(eventPublisher);
  const orderRepo = new PsqlOrderRepository(eventPublisher);
  const basketRepo = new PsqlBasketRepository(eventPublisher);
  const userRepo = new PsqlUserRepository(eventPublisher);

  const addItemToBasketUseCase = new AddItemToBasketUseCase(basketRepo, basketRepo);
  const removeItemFromBasketUseCase = new RemoveItemFromBasketUseCase(basketRepo, basketRepo);
  const createProductUseCase = new CreateProductUseCase(productRepo);
  const createOrderFromBasketUseCase = new CreateOrderFromBasketUseCase(basketRepo, orderRepo);
  const payOrderUseCase = new PayOrderUseCase(orderRepo, orderRepo);
  const getRandomProductUseCase = new GetRandomProductUseCase(productRepo);
  const getOrCreateUserUseCase = new GetOrCreateUserUseCase(userRepo, userRepo);
  const getOrCreateUserBasketUseCase = new GetOrCreateUserBasketUseCase(basketRepo, basketRepo);
  const clearBasketUseCase = new ClearBasketUseCase(basketRepo, basketRepo);
  const getProductByIdUseCase = new GetProductByIdUseCase(productRepo);
  const getUserOrderUseCase = new GetUserOrderUseCase(orderRepo);

  const basketManager = new BasketManager(
    addItemToBasketUseCase,
    removeItemFromBasketUseCase,
    getProductByIdUseCase,
    getOrCreateUserUseCase,
    getOrCreateUserBasketUseCase,
    clearBasketUseCase,
  );
  const orderManager = new OrderManager(
    createOrderFromBasketUseCase,
    payOrderUseCase,
    getOrCreateUserUseCase,
    getOrCreateUserBasketUseCase,
    getUserOrderUseCase,
    getProductByIdUseCase,
  );
  const productManager = new ProductManager(getRandomProductUseCase, createProductUseCase);

  return {
    eventPublisher,
    productRepo,
    orderRepo,
    basketRepo,
    userRepo,

    addItemToBasketUseCase,
    removeItemFromBasketUseCase,
    createProductUseCase,
    createOrderFromBasketUseCase,
    payOrderUseCase,
    getRandomProductUseCase,
    getOrCreateUserUseCase,
    getOrCreateUserBasketUseCase,
    clearBasketUseCase,
    getProductByIdUseCase,
    getUserOrderUseCase,

    basketManager,
    orderManager,
    productManager,
  };
}
