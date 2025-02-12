import { Repository } from './repository';

export interface Transaction {
  getRepository<T extends Repository>(repository: T): T;
}
