import { render } from '@folio/jest-config-stripes/testing-library/react';

import { FieldInventory } from './FieldInventory';

jest.mock('../FieldLocation', () => ({
  FieldLocationFinal: jest.fn().mockReturnValue('FieldLocationFinal'),
}));
jest.mock('../FieldHolding', () => ({
  FieldHolding: jest.fn().mockReturnValue('FieldHolding'),
}));

const renderFieldInventory = (props = {}) => (render(
  <FieldInventory
    locations={[]}
    locationIds={[]}
    onChange={jest.fn()}
    {...props}
  />,
));

describe('FieldInventory component', () => {
  it('should display location field when not connected to instance', () => {
    const { getByText } = renderFieldInventory({ labelless: true });

    expect(getByText('FieldLocationFinal')).toBeDefined();
  });

  it('should display holding field when connected to instance', () => {
    const { getByText } = renderFieldInventory({ instanceId: 'instanceId' });

    expect(getByText('FieldHolding')).toBeDefined();
  });
});
