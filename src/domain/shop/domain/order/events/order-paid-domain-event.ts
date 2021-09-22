import { DomainEvent } from '../../../../common/types/domain-event';
import { OrderId } from '../order';

export class OrderPaidDomainEvent extends DomainEvent {
  constructor(readonly orderId: OrderId) {
    super();
  }
}
