/* Developed collaboratively using AI (Cursor) */

import { EventService } from '../EventService';

describe('EventService', () => {
  it('should handle on/emit and error handling', () => {
    const errors = [];
    const svc = new EventService({
      onListenerError: (e, ctx) => errors.push({ e, ctx }),
    });
    const received = [];

    svc.on('ping', (data) => received.push(data));
    svc.on('ping', () => { throw new Error('boom'); });

    svc.emit('ping', { ok: true });
    expect(received).toEqual([{ ok: true }]);
    expect(errors.length).toBe(1);
    expect(svc.hasListeners()).toBe(true);
  });

  it('should handle context tracking and cleanup', () => {
    const svc = new EventService();
    const ctx = {};
    const unsub = svc.on('e1', () => {}, ctx);

    expect(svc.getStats().contextsCount).toBe(1);
    unsub();
    svc.cleanupContext(ctx);
    expect(svc.getStats().contextsCount).toBe(0);
  });

  it('should find nested events with getEventsWithPrefix', () => {
    const svc = new EventService();
    const a = () => {};
    const b = () => {};

    svc.on('change:array[0].field', a);
    svc.on('change:array.other', b);
    const res = svc.getEventsWithPrefix('change:array');

    expect(res).toEqual(expect.arrayContaining(['change:array[0].field', 'change:array.other']));
  });

  it('should remove all listeners and reset stats', () => {
    const svc = new EventService();

    svc.on('a', () => {});
    svc.on('b', () => {});
    const removed = svc.removeAllListeners();

    expect(removed).toBeGreaterThanOrEqual(2);
    expect(svc.hasListeners()).toBe(false);
  });

  it('should handle error logging when logErrors is enabled', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const svc = new EventService({ logErrors: true });

    svc.on('test', () => { throw new Error('test error'); });
    svc.emit('test', {});
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should throw errors when error handling is disabled', () => {
    const svc = new EventService({ enableErrorHandling: false });

    svc.on('test', () => { throw new Error('test error'); });
    expect(() => svc.emit('test', {})).toThrow('test error');
  });
});
