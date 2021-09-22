import { Product, ProductName, ProductPhoto, ProductPrice } from '../../../common/product/domain/product/product';

export interface CreateProduct {
  execute(name: ProductName, price: ProductPrice, photo: ProductPhoto): Promise<Product>;
}
