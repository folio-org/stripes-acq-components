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
  });

  describe('cancelAnimationFrame', () => {
    it('should use cancelAnimationFrame when available', () => {
      const cafSpy = jest.spyOn(global, 'cancelAnimationFrame');

      service.cancelAnimationFrame(123);

      expect(cafSpy).toHaveBeenCalledWith(123);

      cafSpy.mockRestore();
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
