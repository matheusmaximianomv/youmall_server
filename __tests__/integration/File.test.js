import request from 'supertest';
import { resolve } from 'path';

import app from '../../src/app';
import connection from '../../src/database';

describe('File', () => {
  afterAll(() => {
    connection.destroy();
  });

  test('Should to receive status positive when passed a valid id', async () => {
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

    const file = await request(app)
      .get(`/files/${body.id_file}`)
      .set('Authorization', `Bearer ${token}`);

    expect(file.status).toBe(200);
  });

  test('Should to receive status negative when passed a id of file not exists', async () => {
    const {
      body: { token },
    } = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    const file = await request(app)
      .get('/files/asdfeu')
      .set('Authorization', `Bearer ${token}`);

    expect(file.status).toBe(400);
  });
});
