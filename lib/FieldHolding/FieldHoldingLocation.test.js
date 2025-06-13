import noop from 'lodash/noop';
import { Form } from 'react-final-form';

import { render } from '@folio/jest-config-stripes/testing-library/react';

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
  locationFieldName = 'locationId',
}) => (render(
  <Form
    onSubmit={noop}
    render={() => (
      <FieldHoldingLocation
        isNonInteractive={isNonInteractive}
        location={location}
        label={label}
        required
        onClearLocation={onClearLocation}
        locationFieldName={locationFieldName}
      />
    )}
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
