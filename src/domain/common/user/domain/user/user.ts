import { UserId } from './user-id';
import { AggregateRoot } from '../../../types/aggregate-root';
import { UserCreatedDomainEvent } from './events/user-created-domain-event';

export type UserTgId = number;
export type UserName = string;

export class User extends AggregateRoot<UserId> {
  private constructor(
    public id: UserId,
    readonly tgId: UserTgId,
    readonly username: UserName,
  ) {
    super(id);
  }

  static from(id: UserId, tgId: UserTgId, username: UserName): User {
    return new User(id, tgId, username);
  }

  static create(tgId: UserTgId, username: UserName): User {
    return new User(-1, tgId, username);
  }

  setIdAfterCreate(id: UserId) {
    this.id = id;
    this.addEvent(new UserCreatedDomainEvent(id));
  }
}
