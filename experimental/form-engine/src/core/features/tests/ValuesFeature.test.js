/* Developed collaboratively using AI (Cursor) */

import { ValuesFeature } from '../ValuesFeature';

describe('ValuesFeature', () => {
  it('should initialize with initial values', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ name: 'test', age: 25 });
    expect(vf.get('name')).toBe('test');
    expect(vf.get('age')).toBe(25);
  });

  it('should get value by path', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ user: { name: 'John', address: { city: 'NYC' } } });
    expect(vf.get('user.name')).toBe('John');
    expect(vf.get('user.address.city')).toBe('NYC');
  });

  it('should set value by path', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ name: 'test' });
    vf.set('name', 'updated');
    expect(vf.get('name')).toBe('updated');
  });

  it('should get all values', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ a: 1, b: 2 });
    const all = vf.getAll();

    expect(all.a).toBe(1);
    expect(all.b).toBe(2);
  });

  it('should set all values', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ a: 1 });
    vf.setAll({ x: 10, y: 20 });
    expect(vf.get('x')).toBe(10);
    expect(vf.get('y')).toBe(20);
  });

  it('should get initial value by path', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ name: 'initial' });
    vf.set('name', 'changed');
    expect(vf.getInitial('name')).toBe('initial');
  });

  it('should get all initial values', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ a: 1, b: 2 });
    vf.set('a', 10);
    const initial = vf.getAllInitial();

    expect(initial.a).toBe(1);
    expect(initial.b).toBe(2);
  });

  it('should reset to initial values', () => {
    const engine = { valuesFeature: null };
    const vf = new ValuesFeature(engine);

    vf.init({ name: 'initial' });
    vf.set('name', 'changed');
    expect(vf.get('name')).toBe('changed');
    vf.reset();
    expect(vf.get('name')).toBe('initial');
  });
});
