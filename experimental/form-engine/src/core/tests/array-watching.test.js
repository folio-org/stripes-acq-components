/**
 * Test: Array field watching behavior
 * Tests what happens when changing foo[0].field and watching 'foo'
 */

import FormEngine from '../FormEngine';

describe('Array field watching', () => {
  let engine;

  beforeEach(() => {
    engine = new FormEngine().init({
      foo: [
        { field: 'value1', other: 'data1' },
        { field: 'value2', other: 'data2' },
      ],
    });
  });

  it('should emit change:foo[0].field when nested field changes', () => {
    const callback = jest.fn();

    engine.on('change:foo[0].field', callback);

    engine.set('foo[0].field', 'newValue', { immediate: true });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('newValue');
  });

  it('should emit change:foo when nested field foo[0].field changes if bubble:true', () => {
    const callback = jest.fn();

    engine.on('change:foo', callback, null, { bubble: true });

    engine.set('foo[0].field', 'newValue', { immediate: true });

    expect(callback).toHaveBeenCalledTimes(1);

    // The entire array should be passed
    const passedValue = callback.mock.calls[0][0];

    expect(passedValue).toEqual([
      { field: 'newValue', other: 'data1' },
      { field: 'value2', other: 'data2' },
    ]);
  });

  it('should NOT emit change:foo when nested field changes if bubble:false', () => {
    const callback = jest.fn();

    engine.on('change:foo', callback, null, { bubble: false });

    engine.set('foo[0].field', 'newValue', { immediate: true });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should emit both change:foo and change:foo[0].field when nested field changes with bubble:true', () => {
    const fooCallback = jest.fn();
    const fooFieldCallback = jest.fn();

    engine.on('change:foo', fooCallback, null, { bubble: true });
    engine.on('change:foo[0].field', fooFieldCallback);

    engine.set('foo[0].field', 'newValue', { immediate: true });

    // Both should fire
    expect(fooCallback).toHaveBeenCalledTimes(1);
    expect(fooFieldCallback).toHaveBeenCalledTimes(1);

    // Foo receives entire array
    expect(fooCallback.mock.calls[0][0]).toEqual([
      { field: 'newValue', other: 'data1' },
      { field: 'value2', other: 'data2' },
    ]);

    // Foo[0].field receives just the field value
    expect(fooFieldCallback.mock.calls[0][0]).toBe('newValue');
  });

  it('should emit change:foo when replacing entire array', () => {
    const fooCallback = jest.fn();
    const fooFieldCallback = jest.fn();

    engine.on('change:foo', fooCallback);
    engine.on('change:foo[0].field', fooFieldCallback);

    const newArray = [
      { field: 'replaced1', other: 'replaced_data1' },
      { field: 'replaced2', other: 'replaced_data2' },
    ];

    engine.set('foo', newArray, { immediate: true });

    // change:foo should fire
    expect(fooCallback).toHaveBeenCalledTimes(1);
    expect(fooCallback).toHaveBeenCalledWith(newArray);

    // change:foo[0].field should also fire because parent changed
    expect(fooFieldCallback).toHaveBeenCalledTimes(1);
    expect(fooFieldCallback).toHaveBeenCalledWith('replaced1');
  });

  it('should deduplicate events in batch when multiple nested fields change with bubble:true', () => {
    const fooCallback = jest.fn();
    const fooField0Callback = jest.fn();
    const fooField1Callback = jest.fn();

    engine.on('change:foo', fooCallback, null, { bubble: true });
    engine.on('change:foo[0].field', fooField0Callback);
    engine.on('change:foo[1].field', fooField1Callback);

    engine.batch(() => {
      engine.set('foo[0].field', 'batch1');
      engine.set('foo[1].field', 'batch2');
      engine.set('foo[0].other', 'batch_other');
    });

    // change:foo should fire only ONCE for all changes
    expect(fooCallback).toHaveBeenCalledTimes(1);

    // Each nested field should fire once
    expect(fooField0Callback).toHaveBeenCalledTimes(1);
    expect(fooField1Callback).toHaveBeenCalledTimes(1);

    // Verify final state
    expect(fooCallback.mock.calls[0][0]).toEqual([
      { field: 'batch1', other: 'batch_other' },
      { field: 'batch2', other: 'data2' },
    ]);
  });

  it('should emit change:foo[0] when foo[0].field changes with bubble:true', () => {
    const foo0Callback = jest.fn();

    engine.on('change:foo[0]', foo0Callback, null, { bubble: true });

    engine.set('foo[0].field', 'newValue', { immediate: true });

    expect(foo0Callback).toHaveBeenCalledTimes(1);
    expect(foo0Callback.mock.calls[0][0]).toEqual({
      field: 'newValue',
      other: 'data1',
    });
  });

  it('should NOT emit change:foo[1].field when foo[0].field changes', () => {
    const foo0FieldCallback = jest.fn();
    const foo1FieldCallback = jest.fn();

    engine.on('change:foo[0].field', foo0FieldCallback);
    engine.on('change:foo[1].field', foo1FieldCallback);

    engine.set('foo[0].field', 'newValue', { immediate: true });

    // Only foo[0].field should fire
    expect(foo0FieldCallback).toHaveBeenCalledTimes(1);
    expect(foo1FieldCallback).toHaveBeenCalledTimes(0);
  });

  it('should emit to parent when deeply nested field changes with bubble:true', () => {
    // Set up deeper structure
    engine.set('foo[0].nested', { deep: 'deepValue' }, { immediate: true });

    const foo0Callback = jest.fn();
    const foo0NestedCallback = jest.fn();

    // Listen to foo[0] with bubble - should catch foo[0].nested.deep changes
    engine.on('change:foo[0]', foo0Callback, null, { bubble: true });
    // Listen to foo[0].nested with bubble - should catch foo[0].nested.deep changes
    engine.on('change:foo[0].nested', foo0NestedCallback, null, { bubble: true });

    // Change deeply nested field
    engine.set('foo[0].nested.deep', 'newDeepValue', { immediate: true });

    // Both parent listeners should fire
    expect(foo0Callback).toHaveBeenCalledTimes(1);
    expect(foo0NestedCallback).toHaveBeenCalledTimes(1);

    // Verify they received correct values
    expect(foo0Callback.mock.calls[0][0]).toEqual({
      field: 'value1',
      other: 'data1',
      nested: { deep: 'newDeepValue' },
    });
    expect(foo0NestedCallback.mock.calls[0][0]).toEqual({ deep: 'newDeepValue' });
  });

  it('should NOT emit to parent when deeply nested field changes without bubble', () => {
    // Set up deeper structure
    engine.set('foo[0].nested', { deep: 'deepValue' }, { immediate: true });

    const foo0Callback = jest.fn();
    const foo0NestedCallback = jest.fn();

    // Listen WITHOUT bubble - should NOT catch nested changes
    engine.on('change:foo[0]', foo0Callback);
    engine.on('change:foo[0].nested', foo0NestedCallback);

    // Change deeply nested field
    engine.set('foo[0].nested.deep', 'newDeepValue', { immediate: true });

    // Parent listeners should NOT fire
    expect(foo0Callback).not.toHaveBeenCalled();
    expect(foo0NestedCallback).not.toHaveBeenCalled();
  });
});
