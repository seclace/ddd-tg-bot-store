import { Product } from '../../../common/product/domain/product/product';

export interface GetRandomProduct {
  execute(): Promise<Product>;
}
