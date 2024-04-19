import React from 'react';

import { render, screen } from '@testing-library/react';

import { CUSTOM_FIELDS } from '../../test/jest/fixtures/customFields';
import { CustomFieldsFilters } from './CustomFieldsFilters';

jest.mock('./CustomFieldsFilter', () => jest.fn(() => <div>CustomFieldsFilter</div>));

const onChange = jest.fn();

const activeFilters = {};

const renderCustomFieldsFilters = (cf) => render(
  <CustomFieldsFilters
    activeFilters={activeFilters}
    customFields={cf}
    onChange={onChange}
  />,
);

describe('CustomFieldsFilters', () => {
  it('should be rendered for each element in customFields', () => {
    renderCustomFieldsFilters(CUSTOM_FIELDS);

    const customFieldsFilters = screen.queryAllByText('CustomFieldsFilter');

    expect(customFieldsFilters).toHaveLength(CUSTOM_FIELDS.length);
  });

  it('should not be rendered if customFields is undefined', () => {
    renderCustomFieldsFilters();

    const customFieldsFilters = screen.queryByText('CustomFieldsFilter');

    expect(customFieldsFilters).toBeNull();
  });
});
