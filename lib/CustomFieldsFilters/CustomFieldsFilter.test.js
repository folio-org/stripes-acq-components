import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { CUSTOM_FIELDS } from 'fixtures/customFields';
import CustomFieldsFilter from './CustomFieldsFilter';

const onChange = jest.fn();

const renderCustomFieldsFilter = (cf) => render(
  <CustomFieldsFilter
    customField={cf}
    onChange={onChange}
  />,
);

describe('CustomFieldsFilter', () => {
  it('should display Multiselect filter', () => {
    const multiselect = CUSTOM_FIELDS.find((cf) => cf.refId === 'multiselect');

    renderCustomFieldsFilter(multiselect);

    expect(screen.getByText('Multiselect')).toBeInTheDocument();
  });

  it('should display Singleselect filter', () => {
    const singleselect = CUSTOM_FIELDS.find((cf) => cf.refId === 'singleselect');

    renderCustomFieldsFilter(singleselect);

    expect(screen.getByText('Singleselect')).toBeInTheDocument();
  });

  it('should display Datepicker filter', () => {
    const datepicker = CUSTOM_FIELDS.find((cf) => cf.refId === 'datepicker');

    renderCustomFieldsFilter(datepicker);

    expect(screen.getByText('stripes-smart-components.customFields Datepicker')).toBeInTheDocument();
  });

  it('should not display filter with undefined type', () => {
    const { container } = renderCustomFieldsFilter({ type: 'UNDEFINED_TYPE' });

    expect(container).toBeEmptyDOMElement();
  });
});
