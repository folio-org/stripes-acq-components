/* Developed collaboratively using AI (Cursor) */

import { SchedulerService } from '../SchedulerService';

describe('SchedulerService', () => {
  let service;

  beforeEach(() => {
    service = new SchedulerService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('scheduleMicrotask', () => {
    it('should use queueMicrotask when available', () => {
      const callback = jest.fn();
      const queueMicrotaskSpy = jest.spyOn(global, 'queueMicrotask');

      service.scheduleMicrotask(callback);

      expect(queueMicrotaskSpy).toHaveBeenCalledWith(callback);

      queueMicrotaskSpy.mockRestore();
    });

    it('should fallback to Promise when queueMicrotask is unavailable', async () => {
      const callback = jest.fn();
      const originalQueueMicrotask = global.queueMicrotask;

      global.queueMicrotask = undefined;

      service.scheduleMicrotask(callback);

      await Promise.resolve();

      expect(callback).toHaveBeenCalled();

      global.queueMicrotask = originalQueueMicrotask;
    });
  });

  describe('scheduleAnimationFrame', () => {
    it('should use requestAnimationFrame when available', () => {
      const callback = jest.fn();
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');

      service.scheduleAnimationFrame(callback);

      expect(rafSpy).toHaveBeenCalledWith(callback);

      rafSpy.mockRestore();
    });

    it('should return request ID', () => {
      const callback = jest.fn();
      const id = service.scheduleAnimationFrame(callback);

      expect(typeof id).toBe('number');
    });

    it('should fallback to setTimeout when requestAnimationFrame is unavailable', () => {
      const callback = jest.fn();
      const originalRAF = global.requestAnimationFrame;

      global.requestAnimationFrame = undefined;

      const id = service.scheduleAnimationFrame(callback);

      expect(typeof id).toBe('number');

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();

      global.requestAnimationFrame = originalRAF;
    });
  });

  describe('cancelAnimationFrame', () => {
    it('should use cancelAnimationFrame when available', () => {
      const cafSpy = jest.spyOn(global, 'cancelAnimationFrame');

      service.cancelAnimationFrame(123);

      expect(cafSpy).toHaveBeenCalledWith(123);

      cafSpy.mockRestore();
    });

    it('should fallback to clearTimeout when cancelAnimationFrame is unavailable', () => {
      const originalCAF = global.cancelAnimationFrame;

      global.cancelAnimationFrame = undefined;

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      service.cancelAnimationFrame(123);

      expect(clearTimeoutSpy).toHaveBeenCalledWith(123);

      clearTimeoutSpy.mockRestore();
      global.cancelAnimationFrame = originalCAF;
    });
  });

  describe('scheduleTimeout', () => {
    it('should schedule callback with delay', () => {
      const callback = jest.fn();

      service.scheduleTimeout(callback, 100);

      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(callback).toHaveBeenCalled();
    });

    it('should return timeout ID', () => {
      const callback = jest.fn();
      const id = service.scheduleTimeout(callback, 100);

      expect(typeof id).toBe('number');
    });
  });

  describe('cancelTimeout', () => {
    it('should cancel scheduled timeout', () => {
      const callback = jest.fn();
      const id = service.scheduleTimeout(callback, 100);

      service.cancelTimeout(id);

      jest.advanceTimersByTime(100);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('scheduleImmediate', () => {
    it('should execute callback immediately', () => {
      const callback = jest.fn();

      service.scheduleImmediate(callback);

      expect(callback).toHaveBeenCalled();
    });
  });
});
