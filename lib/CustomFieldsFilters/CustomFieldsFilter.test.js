import React from 'react';
import { render, screen } from '@testing-library/react';

import { CUSTOM_FIELDS } from '../../test/jest/fixtures/customFields';
import CustomFieldsFilter from './CustomFieldsFilter';

const onChange = jest.fn();

const renderCustomFieldsFilter = (cf) => render(
  <CustomFieldsFilter customField={cf} onChange={onChange} />,
);

describe('CustomFieldsFilter', () => {
  it('should display Multiselect filter', () => {
    const multiselect = CUSTOM_FIELDS.find((cf) => cf.refId === 'multiselect');

    renderCustomFieldsFilter(multiselect);
    expect(screen.getByText('Multiselect')).toBeDefined();
  });

  it('should display Singleselect filter', () => {
    const singleselect = CUSTOM_FIELDS.find((cf) => cf.refId === 'singleselect');

    renderCustomFieldsFilter(singleselect);
    expect(screen.getByText('Singleselect')).toBeDefined();
  });

  it('should display Datepicker filter', () => {
    const datepicker = CUSTOM_FIELDS.find((cf) => cf.refId === 'datepicker');

    renderCustomFieldsFilter(datepicker);
    expect(screen.getByText('stripes-smart-components.customFields Datepicker')).toBeDefined();
  });

  it('should not display filter with undefined type', () => {
    const { container } = renderCustomFieldsFilter({ type: 'UNDEFINED_TYPE' });

    expect(container).toBeEmptyDOMElement();
  });
});
