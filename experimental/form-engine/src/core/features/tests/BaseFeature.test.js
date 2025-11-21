/* Developed collaboratively using AI (Cursor) */

import { BaseFeature } from '../BaseFeature';

describe('BaseFeature', () => {
  let engine;
  let feature;

  beforeEach(() => {
    engine = {
      eventService: { emit: jest.fn() },
    };
    feature = new BaseFeature(engine);
  });

  describe('constructor', () => {
    it('should store engine reference', () => {
      expect(feature.engine).toBe(engine);
    });

    it('should initialize with clean state', () => {
      expect(Object.getPrototypeOf(feature._state)).toBeNull();
    });
  });

  describe('init', () => {
    it('should clear state', () => {
      feature._state.test = 'value';

      feature.init();

      expect(feature._state.test).toBeUndefined();
    });

    it('should create new clean object', () => {
      const oldState = feature._state;

      feature.init();

      expect(feature._state).not.toBe(oldState);
      expect(Object.getPrototypeOf(feature._state)).toBeNull();
    });
  });

  describe('reset', () => {
    it('should clear state', () => {
      feature._state.test = 'value';

      feature.reset();

      expect(feature._state.test).toBeUndefined();
    });

    it('should create new clean object', () => {
      const oldState = feature._state;

      feature.reset();

      expect(feature._state).not.toBe(oldState);
      expect(Object.getPrototypeOf(feature._state)).toBeNull();
    });
  });

  describe('getState', () => {
    it('should return copy of state', () => {
      feature._state.a = 1;
      feature._state.b = 2;

      const state = feature.getState();

      expect(state).toEqual({ a: 1, b: 2 });
    });

    it('should return copy, not reference', () => {
      feature._state.test = 'value';

      const state = feature.getState();

      state.test = 'modified';

      expect(feature._state.test).toBe('value');
    });
  });

  describe('_setState', () => {
    it('should set state value', () => {
      feature._setState('key', 'value');

      expect(feature._state.key).toBe('value');
    });

    it('should overwrite existing value', () => {
      feature._setState('key', 'old');
      feature._setState('key', 'new');

      expect(feature._state.key).toBe('new');
    });
  });

  describe('_getState', () => {
    it('should get state value', () => {
      feature._state.key = 'value';

      const result = feature._getState('key');

      expect(result).toBe('value');
    });

    it('should return undefined for non-existent key', () => {
      const result = feature._getState('nonExistent');

      expect(result).toBeUndefined();
    });
  });

  describe('subclass extension', () => {
    it('should allow subclass to override init', () => {
      class CustomFeature extends BaseFeature {
        init() {
          super.init();
          this._state.initialized = true;
        }
      }

      const custom = new CustomFeature(engine);

      custom.init();

      expect(custom._state.initialized).toBe(true);
    });

    it('should allow subclass to override reset', () => {
      class CustomFeature extends BaseFeature {
        constructor(eng) {
          super(eng);
          this.resetCount = 0;
        }

        reset() {
          super.reset();
          this.resetCount += 1;
        }
      }

      const custom = new CustomFeature(engine);

      custom.reset();
      custom.reset();

      expect(custom.resetCount).toBe(2);
    });
  });
});
