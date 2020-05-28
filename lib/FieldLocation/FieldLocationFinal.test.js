import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import '../../test/jest/__mock__';

import FieldLocationFinal from './FieldLocationFinal';

const locationOptions = [
  { value: '001', label: 'Location #1' },
  { value: '002', label: 'Location #2' },
  { value: '003', label: 'Location #3' },
];

const renderFieldLocationFinal = (locationsForSelect, selectLocation = noop) => (render(
  <IntlProvider locale="en">
    <Form
      onSubmit={noop}
      render={() => (
        <FieldLocationFinal
          locationId={locationId}
          labelId={labelId}
          name="anyFieldName"
          onChange={onChange}
          locationOptions={locationOptions}
          selectLocation={selectLocation}
          locationsForSelect={locationsForSelect}
          name="locationId"
        />
      )}
    />
  </IntlProvider>,
));

describe('FieldLocationFinal component', () => {
  afterEach(cleanup);

  it('should render all passed options', async () => {
    const { findAllByText } = renderFieldLocationFinal(locationOptions);

    const renderedLocationOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationOptions.length);
  });
});
