import { Count } from '../../../common/types/count';
import { UserId } from '../../../common/user/domain/user/user-id';
import { AggregateRoot } from '../../../common/types/aggregate-root';
import { ProductId } from '../../../common/product/domain/product/product';

export type BasketId = number;

export class Basket extends AggregateRoot<BasketId> {
  private constructor(
    public id: BasketId,
    readonly items: Map<ProductId, Count>,
    readonly userId: UserId,
  ) {
    super(id);
  }

  static from(id: BasketId, items: Map<ProductId, Count>, userId: UserId): Basket {
    return new Basket(id, items, userId);
  }

  static create(userId: UserId): Basket {
    return new Basket(-1, new Map(), userId);
  }

  setIdAfterCreate(id: BasketId) {
    this.id = id;
  }

  addItem(productId: ProductId, count: Count = 1): void {
    const nextCount = (this.items.get(productId) || 0) + count;
    this.items.set(productId, nextCount);
  }

  removeItem(productId: ProductId, count: Count = 1): void {
    let nextCount = (this.items.get(productId) || 0) - count;
    nextCount = nextCount < 0 ? 0 : nextCount;
    this.items.set(productId, nextCount);
  }

  clear(): void {
    this.items.clear();
  }
}
