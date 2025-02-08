import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterDefault } from './event-emitter.default';
import { Test } from '@nestjs/testing';
import { EVENT_EMITTER } from '../../../shared/interfaces/event-emitter';

describe('EventEmitter', () => {
  let emitter: EventEmitterDefault;
  let eventEmitter2: EventEmitter2;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [{ provide: EVENT_EMITTER, useClass: EventEmitterDefault }],
    }).compile();

    emitter = moduleRef.get<EventEmitterDefault>(EVENT_EMITTER);
    eventEmitter2 = moduleRef.get<EventEmitter2>(EventEmitter2);
  });

  it('should emit an event when a specific action is performed', async () => {
    const eventName = Symbol('actionPerformed');
    const eventData = { action: 'action1' };

    jest.spyOn(eventEmitter2, 'emitAsync');
    await emitter.emit(eventName, eventData);
    expect(eventEmitter2.emitAsync).toHaveBeenCalledWith(eventName, eventData);
  });
});
