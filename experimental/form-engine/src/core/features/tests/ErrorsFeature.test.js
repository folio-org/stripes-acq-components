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

  // ============================================
  // Edge Cases and Bug Prevention Tests
  // ============================================

  describe('Array error prevention', () => {
    it('should not set array as error and log warning', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('items', ['error1', 'error2']);

      expect(ef.get('items')).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Attempted to set array as error'),
        expect.any(Array),
      );
      consoleErrorSpy.mockRestore();
    });

    it('should filter out arrays in setAll', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.setAll({
        field1: 'valid error',
        field2: ['array', 'error'],
        field3: 'another valid error',
      });

      expect(ef.get('field1')).toBe('valid error');
      expect(ef.get('field2')).toBe(null);
      expect(ef.get('field3')).toBe('another valid error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Found array error'),
        expect.any(Array),
      );
      consoleErrorSpy.mockRestore();
    });

    it('should filter out empty arrays', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.setAll({
        field1: 'valid error',
        field2: [],
      });

      expect(ef.get('field1')).toBe('valid error');
      expect(ef.get('field2')).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge cases with null/undefined/empty', () => {
    it('should handle null error as clear', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error');
      ef.set('email', null);

      expect(ef.get('email')).toBe(null);
      expect(ef.hasError('email')).toBe(false);
    });

    it('should handle undefined error as clear', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error');
      ef.set('email', undefined);

      expect(ef.get('email')).toBe(null);
      expect(ef.hasError('email')).toBe(false);
    });

    it('should handle empty string error as clear', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error');
      ef.set('email', '');

      expect(ef.get('email')).toBe(null);
      expect(ef.hasError('email')).toBe(false);
    });

    it('should handle setAll with empty object', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error', 'form'); // Use 'form' source
      ef.setAll({}, 'form'); // Clear errors from 'form' source

      expect(ef.getAll()).toEqual({});
      expect(ef.isValid()).toBe(true);
    });

    it('should handle setAll with null values', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.setAll({ field1: null, field2: undefined, field3: '' });

      // setAll ignores falsy values (null, undefined, '')
      // Only truthy error messages are set
      const all = ef.getAll();

      expect(all.field1).toBe(undefined);
      expect(all.field2).toBe(undefined);
      expect(all.field3).toBe(undefined);
      expect(ef.isValid()).toBe(true);
    });
  });

  describe('Multiple error sources', () => {
    it('should accumulate errors from different sources', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'Field: Invalid format', 'field');
      ef.set('email', 'Form: Domain not allowed', 'form');

      // get() returns first error
      expect(ef.get('email')).toBe('Field: Invalid format');

      // getErrors() returns all errors with sources
      const errors = ef.getErrors('email');

      expect(errors).toEqual([
        { source: 'field', error: 'Field: Invalid format' },
        { source: 'form', error: 'Form: Domain not allowed' },
      ]);

      // getAll() returns first error for each path
      expect(ef.getAll()).toEqual({
        email: 'Field: Invalid format',
      });
    });

    it('should update error from same source', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'Field: Error 1', 'field');
      ef.set('email', 'Form: Error 2', 'form');
      ef.set('email', 'Field: Error 1 Updated', 'field');

      const errors = ef.getErrors('email');

      expect(errors).toEqual([
        { source: 'field', error: 'Field: Error 1 Updated' },
        { source: 'form', error: 'Form: Error 2' },
      ]);
    });

    it('should clear error from specific source', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'Field: Error', 'field');
      ef.set('email', 'Form: Error', 'form');

      // Clear field error
      ef.clear('email', 'field');

      // Form error should remain
      expect(ef.get('email')).toBe('Form: Error');
      expect(ef.getErrors('email')).toEqual([
        { source: 'form', error: 'Form: Error' },
      ]);

      // Clear form error
      ef.clear('email', 'form');

      expect(ef.get('email')).toBe(null);
      expect(ef.getErrors('email')).toEqual([]);
    });

    it('should clear all errors when source not specified', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'Field: Error', 'field');
      ef.set('email', 'Form: Error', 'form');

      // Clear all errors
      ef.clear('email');

      expect(ef.get('email')).toBe(null);
      expect(ef.getErrors('email')).toEqual([]);
      expect(ef.isValid()).toBe(true);
    });

    it('should only emit when first error changes', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      events.length = 0; // Clear init events

      // Set first error from field source
      ef.set('email', 'Field: Error', 'field');

      expect(events.filter(e => e.name === 'error:email').length).toBe(1);
      events.length = 0;

      // Add second error from form source (first error doesn't change)
      ef.set('email', 'Form: Error', 'form');

      // Should NOT emit because first error is still 'Field: Error'
      expect(events.filter(e => e.name === 'error:email').length).toBe(0);

      events.length = 0;

      // Clear field error (now form error becomes first)
      ef.clear('email', 'field');

      // Should emit because first error changed from 'Field: Error' to 'Form: Error'
      expect(events.filter(e => e.name === 'error:email').length).toBe(1);
      expect(events.find(e => e.name === 'error:email').payload).toBe('Form: Error');
    });
  });

  describe('Event emission', () => {
    it('should emit field-specific error event', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error');

      const fieldEvent = events.find(e => e.name === 'error:email');

      expect(fieldEvent).toBeTruthy();
      expect(fieldEvent.payload).toBe('error');
    });

    it('should emit valid event only when state changes', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error1');
      const validEvents1 = events.filter(e => e.name === EVENTS.VALID);

      ef.set('email', 'error2'); // still invalid
      const validEvents2 = events.filter(e => e.name === EVENTS.VALID);

      expect(validEvents1.length).toBe(1);
      expect(validEvents2.length).toBe(1); // no new event
    });

    it('should emit valid event when transitioning from invalid to valid', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error');
      events.length = 0; // clear
      ef.clear('email');

      const validEvent = events.find(e => e.name === EVENTS.VALID && e.payload.valid === true);

      expect(validEvent).toBeTruthy();
    });

    it('should not emit events when clearing non-existent error', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      events.length = 0; // clear init events

      ef.clear('email'); // clearing non-existent error

      expect(events.length).toBe(0); // no events emitted
    });

    it('should not emit events when setting same error value', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'Invalid email');
      events.length = 0; // clear previous events

      ef.set('email', 'Invalid email'); // setting same error

      expect(events.length).toBe(0); // no events emitted
    });

    it('should not emit events when setting null/undefined on non-existent error', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      events.length = 0; // clear init events

      ef.set('email', null);
      ef.set('name', undefined);
      ef.set('phone', '');

      expect(events.length).toBe(0); // no events emitted for any
    });

    it('should emit error events for all fields in setAll', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.setAll({ email: 'error1', password: 'error2' });

      expect(events.find(e => e.name === 'error:email')).toBeTruthy();
      expect(events.find(e => e.name === 'error:password')).toBeTruthy();
    });
  });

  describe('Multiple error operations', () => {
    it('should handle rapid set/clear operations', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error1');
      ef.set('email', 'error2');
      ef.clear('email');
      ef.set('email', 'error3');

      expect(ef.get('email')).toBe('error3');
    });

    it('should handle errors for multiple fields', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('field1', 'error1');
      ef.set('field2', 'error2');
      ef.set('field3', 'error3');

      expect(ef.getAll()).toEqual({
        field1: 'error1',
        field2: 'error2',
        field3: 'error3',
      });
      expect(ef.isValid()).toBe(false);
    });

    it('should handle clearing some errors', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.setAll({ field1: 'error1', field2: 'error2', field3: 'error3' });
      ef.clear('field2');

      expect(ef.get('field1')).toBe('error1');
      expect(ef.get('field2')).toBe(null);
      expect(ef.get('field3')).toBe('error3');
      expect(ef.isValid()).toBe(false);
    });
  });

  describe('Path edge cases', () => {
    it('should handle nested field paths', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('user.email', 'error');

      expect(ef.get('user.email')).toBe('error');
      expect(ef.hasError('user.email')).toBe(true);
    });

    it('should handle array field paths', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('items[0].name', 'error');

      expect(ef.get('items[0].name')).toBe('error');
    });

    it('should handle very long paths', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      const longPath = 'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p';

      ef.set(longPath, 'error');

      expect(ef.get(longPath)).toBe('error');
    });

    it('should handle special characters in paths', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('field-name', 'error1');
      ef.set('field_name', 'error2');
      ef.set('field.name', 'error3');

      expect(ef.get('field-name')).toBe('error1');
      expect(ef.get('field_name')).toBe('error2');
      expect(ef.get('field.name')).toBe('error3');
      expect(Object.keys(ef.getAll()).length).toBe(3);
    });
  });

  describe('Form validity tracking', () => {
    it('should track validity state changes', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      expect(ef._previousFormValid).toBe(true);

      ef.set('email', 'error');
      expect(ef._previousFormValid).toBe(false);

      ef.clear('email');
      expect(ef._previousFormValid).toBe(true);
    });

    it('should not emit valid event if already valid', () => {
      const events = [];
      const engine = {
        eventService: {
          emit: (name, payload) => events.push({ name, payload }),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      events.length = 0; // clear init events

      ef.set('email', ''); // clears

      const validEvents = events.filter(e => e.name === EVENTS.VALID);

      expect(validEvents.length).toBe(0); // no new valid event
    });

    it('should reset validity tracking on reset', () => {
      const engine = {
        eventService: {
          emit: jest.fn(),
        },
      };
      const ef = new ErrorsFeature(engine);

      ef.init();
      ef.set('email', 'error');
      expect(ef._previousFormValid).toBe(false);

      ef.reset();
      expect(ef._previousFormValid).toBe(null);
    });
  });
});
