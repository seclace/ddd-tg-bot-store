import { CreateProduct } from './create-product';
import { ProductPersister } from '../../../common/product/usecase/product/product-persister';
import { Product, ProductName, ProductPhoto, ProductPrice } from '../../../common/product/domain/product/product';

export class CreateProductUseCase implements CreateProduct {
  constructor(
    private readonly productPersister: ProductPersister,
  ) {}

  async execute(name: ProductName, price: ProductPrice, photo: ProductPhoto): Promise<Product> {
    const product = Product.create(name, price, photo);
    await this.productPersister.save(product);

    return product;
  }
}
