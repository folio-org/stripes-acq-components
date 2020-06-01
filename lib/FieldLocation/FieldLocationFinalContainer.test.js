import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import '../../test/jest/__mock__';

import FieldLocationFinalContainer from './FieldLocationFinalContainer';

const locationsList = [
  { id: '001', name: 'Location #1' },
  { id: '002', name: 'Location #2' },
  { id: '003', name: 'Location #3' },
];
const locationsIds = ['001', '002'];
const fieldLocationLabel = 'Location';

const renderFieldLocationFinalContainer = (labelId, locationIds, locations, onChange = noop) => (render(
  <IntlProvider locale="en">
    <Form
      onSubmit={noop}
      render={() => (
        <FieldLocationFinalContainer
          labelId={labelId}
          name="locationId"
          locationIds={locationIds}
          locations={locations}
          onChange={onChange}
        />
      )}
    />
  </IntlProvider>,
));

describe('FieldLocationFinalContainer component', () => {
  afterEach(cleanup);

  it('should display passed label', () => {
    const { getByText } = renderFieldLocationFinalContainer('Location');

    expect(getByText(fieldLocationLabel)).toBeDefined();
  });

  it('should render options based on passed locationIds', async () => {
    const { findAllByText } = renderFieldLocationFinalContainer('Location', locationsIds, locationsList);

    const renderedLocationOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationsIds.length);
  });
});
