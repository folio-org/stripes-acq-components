/* Developed collaboratively using AI (Cursor) */

import { EVENTS } from '../../../constants';
import { TouchedFeature } from '../TouchedFeature';

describe('TouchedFeature', () => {
  it('should initialize with no touched fields', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const tf = new TouchedFeature(engine);

    tf.init();
    expect(tf.isTouched('email')).toBe(false);
    expect(tf.getTouchedArray()).toEqual([]);
  });

  it('should mark field as touched', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const tf = new TouchedFeature(engine);

    tf.init();
    tf.touch('email');
    expect(tf.isTouched('email')).toBe(true);
    expect(events.find(e => e.name === EVENTS.TOUCH && e.payload.path === 'email')).toBeTruthy();
  });

  it('should not emit event if field is already touched', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const tf = new TouchedFeature(engine);

    tf.init();
    tf.touch('email');
    const eventCount = events.length;

    tf.touch('email');
    expect(events.length).toBe(eventCount);
  });

  it('should get touched array', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const tf = new TouchedFeature(engine);

    tf.init();
    tf.touch('email');
    tf.touch('password');
    const touched = tf.getTouchedArray();

    expect(touched).toContain('email');
    expect(touched).toContain('password');
  });

  it('should cache touched array', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const tf = new TouchedFeature(engine);

    tf.init();
    tf.touch('email');
    const arr1 = tf.getTouchedArray();
    const arr2 = tf.getTouchedArray();

    expect(arr1).toBe(arr2); // same reference due to caching
  });

  it('should invalidate cache when field is touched', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const tf = new TouchedFeature(engine);

    tf.init();
    tf.touch('email');
    const arr1 = tf.getTouchedArray();

    tf.touch('password');
    const arr2 = tf.getTouchedArray();

    expect(arr1).not.toBe(arr2); // different reference after cache invalidation
  });

  it('should reset touched state', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const tf = new TouchedFeature(engine);

    tf.init();
    tf.touch('email');
    tf.reset();
    expect(tf.isTouched('email')).toBe(false);
    expect(tf.getTouchedArray()).toEqual([]);
  });
});
