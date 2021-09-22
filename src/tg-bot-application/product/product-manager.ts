import { Product, ProductName, ProductPhoto, ProductPrice } from '../../domain/common/product/domain/product/product';
import { IProductManager } from './i-product-manager';
import { GetRandomProduct } from '../../domain/shop/usecase/product/get-random-product';
import { CreateProduct } from '../../domain/admin/usecase/product/create-product';

export class ProductManager implements IProductManager {
  constructor(
    private readonly getRandomProductUseCase: GetRandomProduct,
    private readonly createProductUseCase: CreateProduct,
  ) {}

  async getRandomProduct(): Promise<Product> {
    return this.getRandomProductUseCase.execute();
  }

  async createProduct(name: ProductName, price: ProductPrice, photo: ProductPhoto): Promise<Product> {
    return this.createProductUseCase.execute(name, price,  photo);
  }
}
