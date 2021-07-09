import React from 'react';
import { render } from '@testing-library/react';
import { noop } from 'lodash';

import FieldHoldingLocation from './FieldHoldingLocation';

const testLocation = {
  name: 'Location',
  code: 'code',
};
const locationLabel = 'locationLabel';

const renderFieldHoldingLocation = ({
  isNonInteractive = false,
  location,
  label,
  onClearLocation = noop,
}) => (render(
  <FieldHoldingLocation
    isNonInteractive={isNonInteractive}
    location={location}
    label={label}
    required
    onClearLocation={onClearLocation}
  />,
));

describe('FieldHoldingLocation component', () => {
  it('should display label and location name with code', () => {
    const { getByText } = renderFieldHoldingLocation({
      label: locationLabel,
      location: testLocation,
      isNonInteractive: true,
    });

    expect(getByText(locationLabel)).toBeDefined();
    expect(getByText(`${testLocation.name}(${testLocation.code})`)).toBeDefined();
  });

  it('should display disabled input', () => {
    const { getByTestId } = renderFieldHoldingLocation({
      label: locationLabel,
      location: testLocation,
    });

    expect(getByTestId('holding-location')).toHaveAttribute('disabled');
  });
});
