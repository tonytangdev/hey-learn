export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface TransactionManager {
  execute<T>(transactionFunction: (context: any) => Promise<T>): Promise<T>;
}
