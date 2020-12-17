import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import FieldLocationFinal from './FieldLocationFinal';

const locationOptions = [
  { value: '001', label: 'Location #1' },
  { value: '002', label: 'Location #2' },
  { value: '003', label: 'Location #3' },
];

const fieldLocationLabel = 'Location';

const renderFieldLocationFinal = (
  labelId,
  locationsForSelect,
  selectLocationFromPlugin = noop,
  isDisabled = false,
) => (render(
  <Form
    onSubmit={noop}
    render={() => (
      <FieldLocationFinal
        labelId={labelId}
        name="locationId"
        locationsForSelect={locationsForSelect}
        selectLocationFromPlugin={selectLocationFromPlugin}
        isDisabled={isDisabled}
        required
      />
    )}
  />,
));

describe('FieldLocationFinal component', () => {
  afterEach(cleanup);

  it('should display passed label', () => {
    const { getByText } = renderFieldLocationFinal('Location', locationOptions);

    expect(getByText(fieldLocationLabel)).toBeDefined();
  });

  it('should render all passed options', async () => {
    const { findAllByText } = renderFieldLocationFinal(undefined, locationOptions);

    const renderedLocationOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationOptions.length);
  });
});
