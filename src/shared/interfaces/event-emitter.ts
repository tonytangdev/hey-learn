export const EVENT_EMITTER = Symbol('EVENT_EMITTER');

export interface EventEmitter {
  emit(eventName: symbol, data: unknown): Promise<void>;
}
