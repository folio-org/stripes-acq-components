import { filterSelectValues } from './filterSelectValues';

const dataOptions = [
  { label: 'labelString', value: 'test1' },
  { label: '(label)', value: 'tes2' },
  { label: 'string', value: 'test3' },
  { label: 'l@be1$tring', value: 'test4' },
  { label: '(la/be/l)(st/in/g)', value: 'test5' },
];

describe('filterSelectValues', () => {
  it('should return selection options based on a filter value', () => {
    expect(filterSelectValues('str', dataOptions)).toEqual([
      dataOptions[0],
      dataOptions[2],
    ]);
  });

  it('should return selection options even if a filter value contains regExp special characters', () => {
    expect(filterSelectValues('(', dataOptions)).toEqual([
      dataOptions[1],
      dataOptions[4],
    ]);
    expect(filterSelectValues('$tring', dataOptions)).toEqual([dataOptions[3]]);
  });
});
