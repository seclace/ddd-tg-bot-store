import { Product, ProductId } from '../../domain/product/product';

export interface ProductExtractor {
  getOneById(id: ProductId): Promise<Product | undefined>;
  getAll(): Promise<Product[]>;
}
