import { Injectable } from '@nestjs/common';
import { EventEmitter } from '../../../shared/interfaces/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventEmitterDefault implements EventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emit(eventName: symbol, data: unknown): Promise<void> {
    await this.eventEmitter.emitAsync(eventName, data);
  }
}
