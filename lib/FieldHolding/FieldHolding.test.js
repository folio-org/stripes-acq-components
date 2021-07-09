import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import { FieldHolding } from './FieldHolding';

jest.mock('./useHoldings', () => ({
  useHoldings: jest.fn().mockReturnValue({
    holdings: [
      { id: '01', permanentLocationId: '001' },
      { id: '02', permanentLocationId: '002' },
    ],
  }),
}));

const locations = [
  { name: 'Location #1', code: '', id: '001' },
  { name: 'Location #2', code: '', id: '002' },
];
const holdingLabel = 'Holding';

const renderFieldHolding = ({
  isDisabled = false,
  labelId,
  onChange = noop,
  locationsForDict = locations,
}) => (render(
  <Form
    onSubmit={noop}
    render={() => (
      <FieldHolding
        labelId={labelId}
        locationLabelId="Location"
        locationFieldName="locationId"
        name="holdingId"
        instanceId="instanceId"
        locationsForDict={locationsForDict}
        onChange={onChange}
        required
        isDisabled={isDisabled}
      />
    )}
  />,
));

describe('FieldHolding component', () => {
  afterEach(cleanup);

  it('should display label', () => {
    const { getByText } = renderFieldHolding({ labelId: holdingLabel });

    expect(getByText(holdingLabel)).toBeDefined();
  });

  it('should render holding options', async () => {
    const { findAllByText } = renderFieldHolding({});

    const renderedHoldingOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedHoldingOptions.length).toBe(locations.length);
  });
});
