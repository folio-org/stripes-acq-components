import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import FieldLocationFinalContainer from './FieldLocationFinalContainer';

const locationsList = [
  { id: '001', name: 'Location #1' },
  { id: '002', name: 'Location #2' },
  { id: '003', name: 'Location #3' },
];
const locationsIds = ['001', '002'];
const fieldLocationLabel = 'Location';

const renderFieldLocationFinalContainer = (
  labelId,
  prepopulatedLocationsIds = [],
  locationsForDict = [],
  onChange = noop,
) => (render(
  <Form
    onSubmit={noop}
    render={() => (
      <FieldLocationFinalContainer
        labelId={labelId}
        name="locationId"
        prepopulatedLocationsIds={prepopulatedLocationsIds}
        locationsForDict={locationsForDict}
        onChange={onChange}
      />
    )}
  />,
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
