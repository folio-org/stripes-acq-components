/* Developed collaboratively using AI (Cursor) */

import { EVENTS } from '../../../constants';
import { ActiveFeature } from '../ActiveFeature';

describe('ActiveFeature', () => {
  it('should initialize with no active field', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const af = new ActiveFeature(engine);
    af.init();
    expect(af.getActive()).toBe(null);
    expect(af.isActive('email')).toBe(false);
  });

  it('should focus field', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const af = new ActiveFeature(engine);
    af.init();
    af.focus('email');
    expect(af.getActive()).toBe('email');
    expect(af.isActive('email')).toBe(true);
    expect(events.find(e => e.name === EVENTS.FOCUS && e.payload.path === 'email')).toBeTruthy();
    expect(events.find(e => e.name === EVENTS.ACTIVE && e.payload.active === 'email')).toBeTruthy();
  });

  it('should not emit event if same field is focused again', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const af = new ActiveFeature(engine);
    af.init();
    af.focus('email');
    const eventCount = events.length;
    af.focus('email');
    expect(events.length).toBe(eventCount);
  });

  it('should blur active field', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const af = new ActiveFeature(engine);
    af.init();
    af.focus('email');
    af.blur();
    expect(af.getActive()).toBe(null);
    expect(af.isActive('email')).toBe(false);
    expect(events.find(e => e.name === EVENTS.BLUR && e.payload.path === 'email')).toBeTruthy();
    expect(events.find(e => e.name === EVENTS.ACTIVE && e.payload.active === null)).toBeTruthy();
  });

  it('should not emit event if blur is called when no field is active', () => {
    const events = [];
    const engine = {
      eventService: {
        emit: (name, payload) => events.push({ name, payload }),
      },
    };
    const af = new ActiveFeature(engine);
    af.init();
    af.blur();
    expect(events.length).toBe(0);
  });

  it('should switch active field', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const af = new ActiveFeature(engine);
    af.init();
    af.focus('email');
    expect(af.getActive()).toBe('email');
    af.focus('password');
    expect(af.getActive()).toBe('password');
    expect(af.isActive('email')).toBe(false);
  });

  it('should reset active state', () => {
    const engine = {
      eventService: {
        emit: () => {},
      },
    };
    const af = new ActiveFeature(engine);
    af.init();
    af.focus('email');
    af.reset();
    expect(af.getActive()).toBe(null);
  });
});

