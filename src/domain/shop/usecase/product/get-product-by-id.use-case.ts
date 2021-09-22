import { Product, ProductId } from '../../../common/product/domain/product/product';
import { ProductExtractor } from '../../../common/product/usecase/product/product-extractor';
import { GetProductById } from './get-product-by-id';
import { ProductNotFoundError } from '../../../common/product/domain/product/errors/product-not-found-error';

export class GetProductByIdUseCase implements GetProductById {
  constructor(
    private readonly productExtractor: ProductExtractor,
  ) {}

  async execute(id: ProductId): Promise<Product> {
    const product = await this.productExtractor.getOneById(id);
    if (!product) {
      throw new ProductNotFoundError();
    }
    return product;
  }
}
