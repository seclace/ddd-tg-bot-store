import { DomainEvent } from '../../../../common/types/domain-event';
import { UserId } from '../../../../common/user/domain/user/user-id';
import { OrderId } from '../order';

export class OrderCreatedDomainEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
    readonly orderId: OrderId,
  ) {
    super();
  }
}
