import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import '../../test/jest/__mock__';

import FieldLocation from './FieldLocation';

const locationOptions = [
  { value: '001', label: 'Location #1' },
  { value: '002', label: 'Location #2' },
  { value: '003', label: 'Location #3' },
];

const fieldLocationLabel = 'Location';

const renderFieldLocation = (labelId, locationsForSelect, selectLocationFromPlugin = noop) => (render(
  <IntlProvider locale="en">
    <Form
      onSubmit={noop}
      render={() => (
        <FieldLocation
          labelId={labelId}
          name="locationId"
          locationsForSelect={locationsForSelect}
          selectLocationFromPlugin={selectLocationFromPlugin}
          required
        />
      )}
    />
  </IntlProvider>,
));

describe('FieldLocation component', () => {
  afterEach(cleanup);

  it('should display passed label', () => {
    const { getByText } = renderFieldLocation('Location', locationOptions);

    expect(getByText(fieldLocationLabel)).toBeDefined();
  });

  it('should render all passed options', async () => {
    const { findAllByText } = renderFieldLocation(undefined, locationOptions);

    const renderedLocationOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationOptions.length);
  });
});
