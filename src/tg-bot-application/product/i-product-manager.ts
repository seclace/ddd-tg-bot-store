import { Product, ProductName, ProductPhoto, ProductPrice } from '../../domain/common/product/domain/product/product';

export interface IProductManager {
  getRandomProduct(): Promise<Product>;
  createProduct(name: ProductName, price: ProductPrice, photo: ProductPhoto): Promise<Product>;
}
