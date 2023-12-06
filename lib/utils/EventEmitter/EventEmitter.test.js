import { EventEmitter } from './EventEmitter';

const EVENT_TYPE = 'test-event-type';
const callback = jest.fn();
const payload = 'Test payload';

describe('EventEmitter', () => {
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
    callback.mockClear();
  });

  it('should add and invoke event listeners', () => {
    emitter.on(EVENT_TYPE, callback);
    emitter.emit(EVENT_TYPE, payload);

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ detail: payload }));
  });

  it('should remove event listeners', () => {
    emitter.on(EVENT_TYPE, callback);
    emitter.off(EVENT_TYPE, callback);
    emitter.emit(EVENT_TYPE, payload);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should emit events with the correct data', () => {
    emitter.on(EVENT_TYPE, callback);
    emitter.emit(EVENT_TYPE, payload);

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ detail: payload }));
  });

  describe('with configuration', () => {
    it('should create a shared EventTarget for instances with singleton set to true', () => {
      const emitter1 = new EventEmitter({ singleton: true });
      const emitter2 = new EventEmitter({ singleton: true });

      expect(emitter1.eventTarget).toBe(emitter2.eventTarget);
    });

    it('should create separate EventTargets for instances with singleton set to false', () => {
      const emitter3 = new EventEmitter();
      const emitter4 = new EventEmitter();

      expect(emitter3.eventTarget).not.toBe(emitter4.eventTarget);
    });
  });
});
