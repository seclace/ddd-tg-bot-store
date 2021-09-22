import { AggregateRoot } from '../../../types/aggregate-root';
import { ProductCreatedDomainEvent } from './events/product-created-domain-event';

export type ProductId = number;
export type ProductName = string;
export type ProductPrice = number;
export type ProductPhoto = string;

export class Product extends AggregateRoot<ProductId> {
  constructor(
    public id: ProductId,
    readonly name: ProductName,
    readonly price: ProductPrice,
    readonly photo: ProductPhoto,
  ) {
    super(id);
  }

  static from(id: ProductId, name: ProductName, price: ProductPrice, photo: ProductPhoto): Product {
    return new Product(id, name, price, photo);
  }

  static create(name: ProductName, price: ProductPrice, photo: ProductPhoto): Product {
    return new Product(-1, name, price, photo);
  }

  setIdAfterCreate(id: ProductId) {
    this.id = id;
    this.addEvent(new ProductCreatedDomainEvent(id));
  }
}
