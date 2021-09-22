import { GetRandomProduct } from './get-random-product';
import { Product } from '../../../common/product/domain/product/product';
import { ProductExtractor } from '../../../common/product/usecase/product/product-extractor';

export class GetRandomProductUseCase implements GetRandomProduct {
  constructor(
    private readonly productExtractor: ProductExtractor,
  ) {}

  async execute(): Promise<Product> {
    const products = await this.productExtractor.getAll();
    const randomIndex = Math.round(Math.random() * (products.length - 1));
    return products[randomIndex];
  }
}
