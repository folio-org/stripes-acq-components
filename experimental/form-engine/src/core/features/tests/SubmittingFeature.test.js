/* Developed collaboratively using AI (Cursor) */

import { EVENTS } from '../../../constants';
import { SubmittingFeature } from '../SubmittingFeature';

describe('SubmittingFeature', () => {
  it('should initialize with not submitting and not succeeded', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
      cacheService: {
        clearFormStateCache: () => {},
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    expect(sf.isSubmitting()).toBe(false);
    expect(sf.hasSubmitSucceeded()).toBe(false);
  });

  it('should start submitting', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
      cacheService: {
        clearFormStateCache: () => {},
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    sf.start();
    expect(sf.isSubmitting()).toBe(true);
    expect(events.find(e => e.name === EVENTS.SUBMITTING && e.payload.submitting === true)).toBeTruthy();
  });

  it('should stop submitting', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
      cacheService: {
        clearFormStateCache: () => {},
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    sf.start();
    sf.stop();
    expect(sf.isSubmitting()).toBe(false);
    expect(events.find(e => e.name === EVENTS.SUBMITTING && e.payload.submitting === false)).toBeTruthy();
  });

  it('should set submit succeeded state', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
      cacheService: {
        clearFormStateCache: () => {},
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    sf.setSubmitSucceeded(true);
    expect(sf.hasSubmitSucceeded()).toBe(true);
  });

  it('should clear cache when submitting state changes', () => {
    const clearCache = jest.fn();
    const engine = {
      eventService: {
        emit: () => {},
      },
      cacheService: {
        clearFormStateCache: clearCache,
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    sf.setSubmitting(true);
    expect(clearCache).toHaveBeenCalled();
  });

  it('should clear cache when submit succeeded state changes', () => {
    const clearCache = jest.fn();
    const engine = {
      eventService: {
        emit: () => {},
      },
      cacheService: {
        clearFormStateCache: clearCache,
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    sf.setSubmitSucceeded(true);
    expect(clearCache).toHaveBeenCalled();
  });

  it('should reset submitting state', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
      cacheService: {
        clearFormStateCache: () => {},
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    sf.start();
    sf.setSubmitSucceeded(true);
    sf.reset();
    expect(sf.isSubmitting()).toBe(false);
    expect(sf.hasSubmitSucceeded()).toBe(false);
  });

  it('should not emit event if submitting state does not change', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
      cacheService: {
        clearFormStateCache: () => {},
      },
    };
    const sf = new SubmittingFeature(engine);

    sf.init();
    sf.setSubmitting(false);
    expect(events.length).toBe(0);
  });
});
