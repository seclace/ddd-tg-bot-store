import { DomainEvent } from '../../../../types/domain-event';
import { ProductId } from '../product';

export class ProductCreatedDomainEvent extends DomainEvent {
  constructor(
    readonly productId: ProductId,
  ) {
    super();
  }
}
