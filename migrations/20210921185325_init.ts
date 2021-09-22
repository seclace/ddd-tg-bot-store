import { Knex } from 'knex';

const T_USERS = 't_users';
const T_PRODUCTS = 't_products';
const T_ORDERS = 't_orders';
const T_ORDER_PRODUCTS = 't_order_products';
const T_BASKETS = 't_baskets';
const T_BASKET_PRODUCTS = 't_basket_products';

export async function up(knex: Knex): Promise<void> {
  const isUsersExist = await knex.schema.hasTable(T_USERS);
  if (!isUsersExist) {
    await knex.schema.createTable(T_USERS, t => {
      t.increments('id').primary();
      t.integer('tgId').notNullable().unique();
      t.string('username', 128).nullable();
    });
  }

  const isProductsExist = await knex.schema.hasTable(T_PRODUCTS);
  if (!isProductsExist) {
    await knex.schema.createTable(T_PRODUCTS, t => {
      t.increments('id').primary();
      t.string('name', 128).notNullable();
      t.integer('price').notNullable();
      t.string('photo', 512).notNullable();
    });
  }

  const isOrdersExist = await knex.schema.hasTable(T_ORDERS);
  if (!isOrdersExist) {
    await knex.schema.createTable(T_ORDERS, t => {
      t.increments('id').primary();
      t.boolean('isPaid').defaultTo(false);
      t.timestamp('paidAt');

      t.integer('userId');
      t.foreign('userId')
        .references('id')
        .inTable(T_USERS)
        .onDelete('RESTRICT');
    });
  }

  const isOrderProductsExist = await knex.schema.hasTable(T_ORDER_PRODUCTS);
  if (!isOrderProductsExist) {
    await knex.schema.createTable(T_ORDER_PRODUCTS, t => {
      t.integer('count').notNullable();

      t.integer('orderId');
      t.foreign('orderId')
        .references('id')
        .inTable(T_ORDERS)
        .onDelete('RESTRICT');

      t.integer('productId');
      t.foreign('productId')
        .references('id')
        .inTable(T_PRODUCTS)
        .onDelete('RESTRICT');
    });
  }

  const isBasketsExist = await knex.schema.hasTable(T_BASKETS);
  if (!isBasketsExist) {
    await knex.schema.createTable(T_BASKETS, t => {
      t.increments('id').primary();

      t.integer('userId');
      t.foreign('userId')
        .references('id')
        .inTable(T_USERS)
        .onDelete('RESTRICT');
    });
  }

  const isBasketProductsExist = await knex.schema.hasTable(T_BASKET_PRODUCTS);
  if (!isBasketProductsExist) {
    await knex.schema.createTable(T_BASKET_PRODUCTS, t => {
      t.integer('count').notNullable();

      t.integer('basketId');
      t.foreign('basketId')
        .references('id')
        .inTable(T_BASKETS)
        .onDelete('RESTRICT');

      t.integer('productId');
      t.foreign('productId')
        .references('id')
        .inTable(T_PRODUCTS)
        .onDelete('RESTRICT');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(T_BASKET_PRODUCTS);
  await knex.schema.dropTableIfExists(T_BASKETS);
  await knex.schema.dropTableIfExists(T_ORDER_PRODUCTS);
  await knex.schema.dropTableIfExists(T_ORDERS);
  await knex.schema.dropTableIfExists(T_PRODUCTS);
  await knex.schema.dropTableIfExists(T_USERS);
}
