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
      .attach('file', resolve(__dirname, '..', 'files', 'roupas_A.jpg'));

    expect(body.id_file).not.toBe(null);
  });

  test('Should return the an error when an id of a non-existent product is passed', async () => {
    const {
      body: { token },
    } = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    const response = await request(app)
      .put(`/products/${1999}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Tênis Super Manêrio')
      .field('description', 'Tênis para praticar esportes')
      .field('stock', 2)
      .field('price', 20.5)
      .field('size', '3637')
      .field('id_type', 4)
      .attach('file', resolve(__dirname, '..', 'files', 'roupas_A.jpg'));

    expect({ status: response.status, error: response.body.error }).toEqual({
      status: 400,
      error: 'Product is not exist.',
    });
  });

  test('Should allow that add an image to a product already registered', async () => {
    const {
      body: { token },
    } = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    const product = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Short Masculino',
        description: 'Short Preto Jeans',
        stock: 10,
        price: 30,
        size: '40',
        id_file: null,
        id_owner: 1,
        id_type: 3,
      });

    expect(product.status).toBe(201);

    const product_updated = await request(app)
      .put(`/products/${product.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', resolve(__dirname, '..', 'files', 'roupas_B.jpg'));

    expect(product_updated.status).toBe(200);

    const file = await request(app)
      .get(`/files/${product_updated.body.id_file}`)
      .set('Authorization', `Bearer ${token}`);

    expect(file.body).toHaveProperty('id');
  });

  test('Should allow to update an image of the a product after your created', async () => {
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
      .attach('file', resolve(__dirname, '..', 'files', 'roupas_A.jpg'));

    expect(body.id_file).not.toBe(null);

    const {
      body: { originalName },
    } = await request(app)
      .get(`/files/${body.id_file}`)
      .set('Authorization', `Bearer ${token}`);

    expect(originalName).toBe('roupas_A.jpg');

    const product_updated = await request(app)
      .put(`/products/${body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', resolve(__dirname, '..', 'files', 'roupas_B.jpg'));

    const {
      body: { originalName: new_originalName },
    } = await request(app)
      .get(`/files/${product_updated.body.id_file}`)
      .set('Authorization', `Bearer ${token}`);

    expect(new_originalName).toBe('roupas_B.jpg');
  });

  test('Should do not allow another user to update a product that does not belong to him', async () => {
    const {
      body: { token },
    } = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    const product = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Short Masculino',
        description: 'Short Preto Jeans',
        stock: 10,
        price: 30,
        size: '40',
        id_file: null,
        id_owner: 1,
        id_type: 3,
      });

    expect(product.status).toBe(201);

    const {
      body: { token: token_lucas },
    } = await request(app).post('/sessions').send({
      email: 'lucas@email.com',
      password: '123456789',
    });

    const product_updated = await request(app)
      .put(`/products/${product.body.id}`)
      .set('Authorization', `Bearer ${token_lucas}`)
      .attach('file', resolve(__dirname, '..', 'files', 'roupas_B.jpg'));

    expect(product_updated.status).toBe(400);
  });
});
