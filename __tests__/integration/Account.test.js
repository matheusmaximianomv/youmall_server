import request from 'supertest';
import faker from 'faker';

import generator from '../utils/GenerateCpf';

import app from '../../src/app';
import connection from '../../src/database';

describe('Account', () => {
  afterAll(() => {
    connection.destroy();
  });

  test('Should to receive a status code of created', async () => {
    const username = faker.name.firstName();
    const fullname = `${username} ${faker.name.lastName()}`;
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await request(app).post('/account').send({
      fullname,
      username,
      email,
      password,
      cpf: generator(),
    });

    expect(response.status).toBe(201);
  });

  test('Should to receive an error when send an email already exist.', async () => {
    const username = faker.name.firstName();
    const fullname = `${username} ${faker.name.lastName()}`;
    const password = faker.internet.password();

    const response = await request(app).post('/account').send({
      fullname,
      username,
      email: 'matheus@email.com',
      password,
      cpf: generator(),
    });

    expect({ status: response.status, error: response.body.error }).toEqual({
      status: 400,
      error: 'Email already in use.',
    });
  });

  test('Should to receive an error when send an username already exists.', async () => {
    const username = 'Matheus Max';
    const fullname = `${username} ${faker.name.lastName()}`;
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await request(app).post('/account').send({
      fullname,
      username,
      email,
      password,
      cpf: generator(),
    });

    expect({ status: response.status, error: response.body.error }).toEqual({
      status: 400,
      error: 'Username already in use.',
    });
  });

  test('Should to receive an error when send an CPF already exists.', async () => {
    const username = faker.name.firstName();
    const fullname = `${username} ${faker.name.lastName()}`;
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await request(app).post('/account').send({
      fullname,
      username,
      email,
      password,
      cpf: '123.456.789-10',
    });

    expect({ status: response.status, error: response.body.error }).toEqual({
      status: 400,
      error: 'CPF already in use.',
    });
  });
});
