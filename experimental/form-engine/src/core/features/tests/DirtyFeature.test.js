/* Developed collaboratively using AI (Cursor) */

import {
  DIRTY_CHECK_STRATEGY,
  EVENTS,
  FIELD_EVENT_PREFIXES,
  FORM_ENGINE_OPTIONS,
} from '../../../constants';
import { DirtyFeature } from '../DirtyFeature';

const makeEngine = (values, initialValues, options = {}) => {
  const events = [];

  return {
    valuesFeature: {
      values,
      initialValues,
      get: (p) => {
        const parts = p.split('.');
        let cur = values;

        parts.forEach(k => { cur = cur?.[k]; });

        return cur;
      },
    },
    touchedFeature: { touched: new Set() },
    eventService: {
      emit: (name, payload) => events.push({ name, payload }),
      _events: events,
    },
    options: {
      [FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY]: DIRTY_CHECK_STRATEGY.VALUES,
      ...options,
    },
  };
};

describe('DirtyFeature', () => {
  it('should emit initial dirty state when queueCheck is called with immediate flag', () => {
    const engine = makeEngine({ a: 1 }, { a: 1 });
    const df = new DirtyFeature(engine);

    df.init();
    df.queueCheck('a', true);
    expect(engine.eventService._events.find(e => e.name === `${FIELD_EVENT_PREFIXES.DIRTY}a`)).toBeTruthy();
    expect(df.isPristine()).toBe(true);
  });

  it('should detect dirty state when value changes', () => {
    const engine = makeEngine({ a: 1 }, { a: 1 });
    const df = new DirtyFeature(engine);

    df.init();
    engine.valuesFeature.values.a = 2;
    df.queueCheck('a', true);
    const becameDirty = engine.eventService._events.find(e => e.name === EVENTS.DIRTY && e.payload?.dirty === true);

    expect(becameDirty).toBeTruthy();
    expect(df.isDirty()).toBe(true);
  });

  it('should use TOUCHED strategy when configured', () => {
    const engine = makeEngine({ a: 1 }, { a: 1 }, { [FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY]: DIRTY_CHECK_STRATEGY.TOUCHED });

    engine.touchedFeature.touched.add('a');
    const df = new DirtyFeature(engine);

    df.init();
    df.queueCheck('a', true);
    expect(df.isDirty()).toBe(true);
  });

  it('should return all dirty fields', () => {
    const engine = makeEngine({ a: 1, b: 2 }, { a: 1, b: 2 });
    const df = new DirtyFeature(engine);

    df.init();
    engine.valuesFeature.values.a = 10;
    df.queueCheck('a', true);
    df.queueCheck('b', true);
    const dirtyFields = df.getAllDirtyFields();

    expect(dirtyFields.a).toBe(true);
  });

  it('should handle reset', () => {
    const engine = makeEngine({ a: 1 }, { a: 1 });
    const df = new DirtyFeature(engine);

    df.init();
    engine.valuesFeature.values.a = 2;
    df.queueCheck('a', true);
    expect(df.isDirty()).toBe(true);
    df.reset();
    expect(df.isPristine()).toBe(true);
  });

  it('should emit pristine event when field becomes pristine', () => {
    const engine = makeEngine({ a: 1 }, { a: 1 });
    const df = new DirtyFeature(engine);

    df.init();
    engine.valuesFeature.values.a = 2;
    df.queueCheck('a', true);
    expect(df.isDirty()).toBe(true);
    engine.valuesFeature.values.a = 1;
    df.queueCheck('a', true);
    const pristineEvent = engine.eventService._events.find(e => e.name === `${FIELD_EVENT_PREFIXES.PRISTINE}a`);

    expect(pristineEvent).toBeTruthy();
  });
});
