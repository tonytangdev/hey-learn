export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

export interface TransactionManager {
  execute(transactionFunction: (context: any) => Promise<void>): Promise<void>;
}
