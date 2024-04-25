import { CUSTOM_FIELDS } from '../../test/jest/fixtures/customFields';
import { buildArrayFieldQuery, buildDateRangeQuery } from '../AcqList';
import { CUSTOM_FIELDS_FILTER } from '../constants';
import { getCustomFieldsFilterMap, getCustomFieldsKeywordIndexes } from './utils';

describe('getCustomFieldsFilterMap', () => {
  it('should return an empty object when customFields is falsy', () => {
    const actual = getCustomFieldsFilterMap();

    expect(actual).toEqual({});
  });

  it('should return a map with correct query functions', () => {
    const expected = {
      [`${CUSTOM_FIELDS_FILTER}.datepicker`]: buildDateRangeQuery.bind(null, `${CUSTOM_FIELDS_FILTER}.datepicker`),
      [`${CUSTOM_FIELDS_FILTER}.multiselect`]: buildArrayFieldQuery.bind(null, `${CUSTOM_FIELDS_FILTER}.multiselect`),
    };
    const actual = getCustomFieldsFilterMap(CUSTOM_FIELDS);

    expect(actual[`${CUSTOM_FIELDS_FILTER}.datepicker`]('2012-03-24:2012-03-26')).toEqual(
      expected[`${CUSTOM_FIELDS_FILTER}.datepicker`]('2012-03-24:2012-03-26'),
    );
    expect(actual[`${CUSTOM_FIELDS_FILTER}.multiselect`](['opt_0', 'opt_1'])).toEqual(
      expected[`${CUSTOM_FIELDS_FILTER}.multiselect`](['opt_0', 'opt_1']),
    );
  });
});

describe('getCustomFieldsKeywordIndexes', () => {
  it('should return an empty array when customFields is falsy', () => {
    const actual = getCustomFieldsKeywordIndexes();

    expect(actual).toEqual([]);
  });

  it('should return searchable custom fields', () => {
    const expected = ['datepicker', 'longtext', 'shorttext'].map((s) => `${CUSTOM_FIELDS_FILTER}.${s}`);
    const actual = getCustomFieldsKeywordIndexes(CUSTOM_FIELDS);

    expect(actual).toEqual(expected);
  });
});
