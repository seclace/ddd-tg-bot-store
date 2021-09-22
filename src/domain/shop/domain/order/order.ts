import { Count } from '../../../common/types/count';
import { AggregateRoot } from '../../../common/types/aggregate-root';
import { UserId } from '../../../common/user/domain/user/user-id';
import { OrderCreatedDomainEvent } from './events/order-created-domain-event';
import { OrderPaidDomainEvent } from './events/order-paid-domain-event';
import { ProductId } from '../../../common/product/domain/product/product';

export type OrderId = number;
export type OrderIsPaid = boolean;

export class Order extends AggregateRoot<OrderId> {
  private constructor(
    public id: OrderId,
    readonly items: Map<ProductId, Count>,
    readonly userId: UserId,
    public isPaid: OrderIsPaid = false,
  ) {
    super(id);
  }

  static create(forUser: UserId, items: Map<ProductId, Count>): Order {
    const order = new Order(-1, items, forUser);

    return order;
  }

  setIdAfterCreate(id: OrderId) {
    this.id = id;
    this.addEvent(new OrderCreatedDomainEvent(this.userId, id));
  }

  static from(id: OrderId, items: Map<ProductId, Count>, userId: UserId): Order {
    return new Order(id, items, userId);
  }

  pay() {
    this.isPaid = true;
    this.addEvent(new OrderPaidDomainEvent(this.id));
  }
}
