/* Developed collaboratively using AI (Cursor) */

import { EVENTS } from '../../../constants';
import { ErrorsFeature } from '../ErrorsFeature';

describe('ErrorsFeature', () => {
  it('should initialize with no errors', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const ef = new ErrorsFeature(engine);

    ef.init();
    expect(ef.isValid()).toBe(true);
    expect(ef.getAll()).toEqual({});
  });

  it('should set error for field', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const ef = new ErrorsFeature(engine);

    ef.init();
    ef.set('email', 'Invalid email');
    expect(ef.get('email')).toBe('Invalid email');
    expect(ef.isValid()).toBe(false);
    expect(events.find(e => e.name === EVENTS.ERROR && e.payload.path === 'email')).toBeTruthy();
  });

  it('should clear error for field', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const ef = new ErrorsFeature(engine);

    ef.init();
    ef.set('email', 'Invalid email');
    ef.clear('email');
    expect(ef.get('email')).toBe(null);
    expect(ef.isValid()).toBe(true);
  });

  it('should set all errors', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const ef = new ErrorsFeature(engine);

    ef.init();
    ef.setAll({ email: 'Invalid email', password: 'Too short' });
    expect(ef.get('email')).toBe('Invalid email');
    expect(ef.get('password')).toBe('Too short');
    expect(ef.isValid()).toBe(false);
  });

  it('should check if field has error', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const ef = new ErrorsFeature(engine);

    ef.init();
    expect(ef.hasError('email')).toBe(false);
    ef.set('email', 'Invalid');
    expect(ef.hasError('email')).toBe(true);
  });

  it('should emit valid event when errors are cleared', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const ef = new ErrorsFeature(engine);

    ef.init();
    ef.set('email', 'Invalid');
    expect(ef.isValid()).toBe(false);
    ef.clear('email');
    const validEvent = events.find(e => e.name === EVENTS.VALID && e.payload.valid === true);

    expect(validEvent).toBeTruthy();
  });

  it('should reset errors', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const ef = new ErrorsFeature(engine);

    ef.init();
    ef.set('email', 'Invalid');
    ef.reset();
    expect(ef.isValid()).toBe(true);
    expect(ef._previousFormValid).toBe(null);
  });
});
