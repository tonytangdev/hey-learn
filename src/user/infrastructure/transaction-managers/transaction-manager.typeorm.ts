import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../../shared/interfaces/transaction-manager';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TransactionManagerTypeORM implements TransactionManager {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(
    transactionFunction: (context: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      return transactionFunction(manager);
    });
  }
}
