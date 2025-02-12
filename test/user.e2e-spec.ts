import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { faker } from '@faker-js/faker';
import { initApp } from './init-app';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await initApp(app);
  });

  it('/users (POST) - should create a new user', () => {
    const payload = { email: faker.internet.email() };

    return request(app.getHttpServer())
      .post('/users')
      .send(payload)
      .expect(HttpStatus.CREATED);
  });

  it('/users (POST) - should return a bad request error if the email is invalid', () => {
    const payload = { email: faker.person.fullName() };
    return request(app.getHttpServer())
      .post('/users')
      .send(payload)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/users (POST) - should return a conflict error if the email is already taken', async () => {
    const payload = { email: faker.internet.email() };
    await request(app.getHttpServer())
      .post('/users')
      .send(payload)
      .expect(HttpStatus.CREATED);
    return request(app.getHttpServer())
      .post('/users')
      .send(payload)
      .expect(HttpStatus.CONFLICT);
  });
});
