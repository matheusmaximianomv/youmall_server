import request from 'supertest';
import { resolve } from 'path';

import connection from '../../src/database';
import app from '../../src/app';

describe('Products', () => {
  afterAll(() => {
    connection.destroy();
  });

  test('Should return all products as long as they do not belong to the logged in user', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    expect(response.body).toHaveProperty('token');

    const response_products = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${response.body.token}`);

    expect(response_products.status).toBe(200);
  });

  test('Should return the product when created no image', async () => {
    const {
      body: { token },
    } = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    const response_products = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Camisa M',
        description: 'Camisa do Tamanho M',
        stock: 5,
        price: 1.5,
        size: 'M',
        id_file: null,
        id_owner: 1,
        id_type: 1,
      });

    expect({
      name: response_products.body.name,
      description: response_products.body.description,
      stock: response_products.body.stock,
      price: response_products.body.price,
      size: response_products.body.size,
      id_file: response_products.body.id_file,
      id_owner: response_products.body.id_owner,
      id_type: response_products.body.id_type,
    }).toEqual({
      name: 'Camisa M',
      description: 'Camisa do Tamanho M',
      stock: 5,
      price: 1.5,
      size: 'M',
      id_file: null,
      id_owner: 1,
      id_type: 1,
    });
  });

  test('Should return the product when created with image', async () => {
    const {
      body: { token },
    } = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    const { body } = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Camisa M')
      .field('description', 'Camisa do Tamanho M')
      .field('stock', 5)
      .field('price', 1.5)
      .field('size', 'M')
      .field('id_owner', 1)
      .field('id_type', 1)
      .attach('file', resolve(__dirname, '..', 'files', 'gato.jpeg'));

    expect(body.id_file).not.toBe(null);
  });
});
