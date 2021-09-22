import { OrderPersister } from '../../usecase/order/order-persister';
import { OrderExtractor } from '../../usecase/order/order-extractor';
import { Order, OrderId } from '../../domain/order/order';
import { EventPublisher } from '../../../common/types/domain-event';
import { UserId } from '../../../common/user/domain/user/user-id';
import { knex } from '../../../../db/knex';
import { T_ORDER_PRODUCTS, T_ORDERS } from '../../../../db/constants';
import { ProductId } from '../../../common/product/domain/product/product';
import { Count } from '../../../common/types/count';

const orderColumns = [
  'id',
  'userId',
];
const orderProductsColumns = [
  'count',
  'productId',
];

export class PsqlOrderRepository implements OrderPersister, OrderExtractor {
  constructor(
    private readonly eventPublisher: EventPublisher,
  ) {}

  async getOneById(orderId: OrderId): Promise<Order | undefined> {
    const entry = await knex(T_ORDERS).select(orderColumns)
      .where({ id: orderId, isPaid: false })
      .first();
    if (!entry) {
      return undefined;
    }
    const products = await knex(T_ORDER_PRODUCTS)
      .select(orderProductsColumns)
      .where('orderId', orderId);
    const productsMap = new Map<ProductId, Count>();
    products.map(({ count, productId }) => productsMap.set(productId, count));

    return Order.from(entry.id, productsMap, entry.userId);
  }

  async save(order: Order): Promise<Order> {
    if (order.id === -1) {
      const [id] = await knex(T_ORDERS).insert({ userId: order.userId }).returning('id');
      order.setIdAfterCreate(id);
    } else {
      await knex(T_ORDERS).update({ isPaid: order.isPaid }).where({ id: order.id });
    }
    await knex(T_ORDER_PRODUCTS)
      .select(orderProductsColumns)
      .where('orderId', order.id)
      .delete();
    const entries: Array<{ count: Count; productId: ProductId; orderId: OrderId }> = [];
    order.items.forEach((count, productId) => entries.push({ count, productId, orderId: order.id }));
    await knex(T_ORDER_PRODUCTS).insert(entries);

    const events = order.popEvents();
    await this.eventPublisher.publish(events);

    return order;
  }

  async getOneByUserId(userId: UserId): Promise<Order | undefined> {
    const entry = await knex(T_ORDERS).select(orderColumns)
      .where({ userId, isPaid: false })
      .first();
    if (!entry) {
      return undefined;
    }
    const products = await knex(T_ORDER_PRODUCTS)
      .select(orderProductsColumns)
      .where('orderId', entry.id);
    const productsMap = new Map<ProductId, Count>();
    products.map(({ count, productId }) => productsMap.set(productId, count));

    return Order.from(entry.id, productsMap, entry.userId);
  }
}
