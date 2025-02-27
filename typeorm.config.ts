import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({
  path: `./.env.${process.env.NODE_ENV || 'development'}`,
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.relational-entity.ts'],
  synchronize: false, // Set to false for safety in production
  migrations: ['src/migrations/*.ts'],
});
