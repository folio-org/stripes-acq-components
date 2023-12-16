import { SEARCH_PARAMETER } from '../AcqList';
import { filterAndSort } from './filterAndSort';

const items = [
  { id: 1, name: 'Item 1', campus: { id: 'campus-1', name: 'Campus 1' }, campusId: 'campus-1' },
  { id: 2, name: 'Item 2', campus: { id: 'campus-2', name: 'Campus 2' }, campusId: 'campus-2' },
  { id: 3, name: 'Item 3', campus: { id: 'campus-1', name: 'Campus 1' }, campusId: 'campus-1' },
];

describe('filterAndSort', () => {
  it('should filter items correctly', () => {
    // CQL query alternative: `(campusId="campus-1" sortby name)`
    expect(filterAndSort(
      { filterMap: { campuses: 'campusId' } },
      { campuses: ['campus-1'] },
      items,
    )).toEqual([items[0], items[2]]);

    // CQL query alternative: `(campus.name="*Campus 2*" sortby name)`
    expect(filterAndSort(
      { queryIndexes: ['campus.name'] },
      { [SEARCH_PARAMETER]: 'Campus 2' },
      items,
    )).toEqual([items[1]]);

    // CQL query alternative: `(campus.name="*Item*" sortby name)`
    expect(filterAndSort(
      { queryIndexes: ['campus.name'] },
      { [SEARCH_PARAMETER]: 'Item' },
      items,
    )).toEqual([]);

    // CQL query alternative: `(foo="*bar*" sortby name)`
    expect(filterAndSort(
      {},
      { foo: 'bar' },
      items,
    )).toEqual([]);

    // CQL query alternative: `(name="*Item*" and campusId="campus-1" sortby name)`
    expect(filterAndSort(
      {
        queryIndexes: ['name'],
        filterMap: { campuses: 'campusId' },
      },
      {
        [SEARCH_PARAMETER]: 'Item',
        campuses: ['campus-1'],
      },
      items,
    )).toEqual([items[0], items[2]]);
  });

  it('should sort items correctly', () => {
    // Ascending order by "name"
    expect(filterAndSort(
      {},
      { sorting: 'name' },
      items,
    )).toEqual(items);

    // Descending order by "name"
    expect(filterAndSort(
      {},
      {
        sorting: 'name',
        sortingDirection: 'descending',
      },
      items,
    )).toEqual(items.toReversed());

    // Ascending order by campus "name" (use sortingMap)
    expect(filterAndSort(
      { sortingMap: { campus: 'campus.name' } },
      {
        sorting: 'campus',
        sortingDirection: 'ascending',
      },
      items,
    )).toEqual([
      items[0],
      items[2],
      items[1],
    ]);
  });
});
