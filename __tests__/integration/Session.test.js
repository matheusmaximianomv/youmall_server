import request from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import connection from '../../src/database';
import generator from '../utils/GenerateCpf';

describe('Authentication', () => {
  afterAll(() => {
    connection.destroy();
  });

  test('Should to receive a JWT Token with credentials valid', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: '123456789',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  test('Should to receive an error when send email invalid', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'negation@email.com',
      password: 'aporjpoerjpofiẃeq1256+',
    });

    expect({ status: response.status, message: response.body.error }).toEqual({
      status: 400,
      message: 'Email or password invalid.',
    });
  });

  test('Should to receive an error when send password invalid', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'matheus@email.com',
      password: 'aporjpoerjpofiẃeq1256+',
    });

    expect({ status: response.status, message: response.body.error }).toEqual({
      status: 400,
      message: 'Email or password invalid.',
    });
  });

  test('Should to make login after created an account', async () => {
    const username = faker.name.firstName();
    const fullname = `${username} ${faker.name.lastName()}`;
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response_account = await request(app).post('/account').send({
      username,
      fullname,
      email,
      password,
      cpf: generator(),
    });

    expect(response_account.status).toBe(201);

    const response_sessions = await request(app).post('/sessions').send({
      email,
      password,
    });

    expect(response_sessions.body).toHaveProperty('token');
  });

  test('Should return an error when token not provided', async () => {
    const response = await request(app).get('/products');

    expect({ status: response.status, error: response.body.error }).toEqual({
      status: 400,
      error: 'Token not provider.',
    });
  });

  test('Should return an error when Badly formatted token', async () => {
    const response = await request(app)
      .get('/products')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );

    expect({ status: response.status, error: response.body.error }).toEqual({
      status: 400,
      error: 'Badly formatted token.',
    });
  });

  test('Should return an error when the generated token does not belong to the application', async () => {
    const response = await request(app)
      .get('/products')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );

    expect({ status: response.status, error: response.body.error }).toEqual({
      status: 401,
      error: 'Token Invalid.',
    });
  });
});
