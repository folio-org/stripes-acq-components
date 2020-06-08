import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import '../../test/jest/__mock__';

import FieldLocationContainer from './FieldLocationContainer';

const locationsList = [
  { id: '001', name: 'Location #1' },
  { id: '002', name: 'Location #2' },
  { id: '003', name: 'Location #3' },
];
const locationsIds = ['001', '002'];
const fieldLocationLabel = 'Location';

const renderFieldLocationContainer = (
  labelId,
  prepopulatedLocationsIds,
  locationsForDict,
  onChange = noop,
) => (render(
  <IntlProvider locale="en">
    <Form
      onSubmit={noop}
      render={() => (
        <FieldLocationContainer
          labelId={labelId}
          name="locationId"
          prepopulatedLocationsIds={prepopulatedLocationsIds}
          locationsForDict={locationsForDict}
          onChange={onChange}
        />
      )}
    />
  </IntlProvider>,
));

describe('FieldLocationContainer component', () => {
  afterEach(cleanup);

  it('should display passed label', () => {
    const { getByText } = renderFieldLocationContainer('Location');

    expect(getByText(fieldLocationLabel)).toBeDefined();
  });

  it('should render options based on passed locationIds', async () => {
    const { findAllByText } = renderFieldLocationContainer('Location', locationsIds, locationsList);

    const renderedLocationOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationsIds.length);
  });
});
