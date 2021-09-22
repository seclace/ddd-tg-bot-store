import { Knex } from 'knex';

const T_PRODUCTS = 't_products';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(T_PRODUCTS).del();

  // Inserts seed entries
  await knex(T_PRODUCTS).insert([
    { name: 'iPhone 6s', price: 3000, photo: 'https://www.e-katalog.ru/jpg_zoom1/644294.jpg' },
    { name: 'Iphone 7', price: 5000, photo: 'https://www.e-katalog.ru/jpg_zoom1/916176.jpg' },
    { name: 'Iphone 8', price: 10000, photo: 'https://www.e-katalog.ru/jpg_zoom1/1204676.jpg' },
    { name: 'Iphone 10', price: 15000, photo: 'https://www.e-katalog.ru/jpg_zoom1/1204677.jpg' },
    { name: 'Iphone 11', price: 15000, photo: 'https://www.e-katalog.ru/jpg_zoom1/1652336.jpg' },
    { name: 'Iphone 12', price: 25000, photo: 'https://www.e-katalog.ru/jpg_zoom1/1887056.jpg' },
    { name: 'Iphone 13', price: 35000, photo: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-family-select-2021?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1629842667000' },
  ]);
}
