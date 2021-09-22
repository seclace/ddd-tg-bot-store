import { DomainEvent } from '../../../../types/domain-event';
import { UserId } from '../user-id';

export class UserCreatedDomainEvent extends DomainEvent {
  constructor(
    readonly userId: UserId,
  ) {
    super();
  }
}
