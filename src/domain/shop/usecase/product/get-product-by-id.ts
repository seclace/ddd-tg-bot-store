import { Product, ProductId } from '../../../common/product/domain/product/product';

export interface GetProductById {
  execute(id: ProductId): Promise<Product>;
}
