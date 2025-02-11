import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { TransactionManagerTypeORM } from './transaction-manager.typeorm';
import { TransactionManager } from '../../../shared/interfaces/transaction-manager';
import { faker } from '@faker-js/faker';

describe('TransactionManagerTypeORM', () => {
  let transactionManager: TransactionManagerTypeORM;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionManagerTypeORM,
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn().mockImplementation((fn) => fn(jest.fn())),
          },
        },
      ],
    }).compile();

    transactionManager = module.get<TransactionManagerTypeORM>(
      TransactionManagerTypeORM,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(transactionManager).toBeDefined();
  });

  it('should execute a transaction function', async () => {
    const mockTransactionFunction = jest.fn().mockResolvedValue('result');
    const result = await transactionManager.execute(mockTransactionFunction);
    expect(result).toBe('result');
    expect(mockTransactionFunction).toHaveBeenCalled();
  });

  it('should handle transaction errors', async () => {
    const mockTransactionFunction = jest
      .fn()
      .mockRejectedValue(new Error('Transaction error'));
    await expect(
      transactionManager.execute(mockTransactionFunction),
    ).rejects.toThrow('Transaction error');
    expect(mockTransactionFunction).toHaveBeenCalled();
  });
});
