export interface Handler<T> {
  handle(dto: T): Promise<void>;
}
