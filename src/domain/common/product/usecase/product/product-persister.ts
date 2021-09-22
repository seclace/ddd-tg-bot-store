import { Product } from '../../domain/product/product';

export interface ProductPersister {
  save(product: Product): Promise<Product>;
}
