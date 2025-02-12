import { Transaction } from './transaction';

export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface TransactionManager {
  execute<T>(operation: (transaction: Transaction) => Promise<T>): Promise<T>;
}
