import { filterArrayValues } from './filterArrayValues';

const filteredValues = ['tag1', 'TaG2', 'tAgAF'];
const values = ['label1', ...filteredValues, 'labEl2'];

describe('filterArrayValues', () => {
  it('should return { renderedItems } with initial options when value is not defined', () => {
    expect(filterArrayValues(null, values).renderedItems).toEqual(values);
    expect(filterArrayValues(undefined, values).renderedItems).toEqual(values);
    expect(filterArrayValues('', values).renderedItems).toEqual(values);
  });

  it('should return { renderedItems } with filtered options for lowercased value', () => {
    expect(filterArrayValues('tag', values).renderedItems).toEqual(filteredValues);
  });

  it('should return { renderedItems } with filtered options for uppercased value', () => {
    expect(filterArrayValues('TAG', values).renderedItems).toEqual(filteredValues);
  });

  it('should return { renderedItems } with filtered options for mixed value', () => {
    expect(filterArrayValues('TAg', values).renderedItems).toEqual(filteredValues);
  });
});
