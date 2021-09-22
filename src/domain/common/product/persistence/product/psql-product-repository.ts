import { ProductExtractor } from '../../usecase/product/product-extractor';
import { Product, ProductId } from '../../domain/product/product';
import { ProductPersister } from '../../usecase/product/product-persister';
import { EventPublisher } from '../../../types/domain-event';
import { knex } from '../../../../../db/knex';
import { T_PRODUCTS } from '../../../../../db/constants';

const columns = [
  'id',
  'name',
  'price',
  'photo',
];

export class PsqlProductRepository implements ProductExtractor, ProductPersister {
  constructor(
    private readonly eventPublisher: EventPublisher,
  ) {
  }

  async getAll(): Promise<Product[]> {
    const entries = await knex(T_PRODUCTS).select(columns);
    return entries.map(e => Product.from(e.id, e.name, e.price, e.photo));
  }

  async save(product: Product): Promise<Product> {
    if (product.id === -1) {
      const [id] = await knex(T_PRODUCTS).insert({
        name: product.name,
        price: product.price,
        photo: product.photo,
      }).returning('id');
      product.setIdAfterCreate(id);
    } else {
      await knex(T_PRODUCTS).update({
        name: product.name,
        price: product.price,
        photo: product.photo,
      });
    }
    const events = product.popEvents();
    await this.eventPublisher.publish(events);

    return product;
  }

  async getOneById(productId: ProductId): Promise<Product | undefined> {
    const { id, name, price, photo } = await knex(T_PRODUCTS).select(columns)
      .where('id', productId)
      .first();
    return Product.from(id, name, price, photo);
  }
}
