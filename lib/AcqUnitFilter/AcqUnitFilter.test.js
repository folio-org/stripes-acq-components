import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';

import '../../test/jest/__mock__';

import AcqUnitFilter from './AcqUnitFilter';

const acqUnitsRecords = [
  { name: 'Unit #1', id: '001' },
  { name: 'Unit #2', id: '002' },
];

const renderAcqUnitFilter = (acqUnits) => (render(
  <IntlProvider locale="en">
    <AcqUnitFilter
      labelId="acqUnits"
      name="acqUnits"
      acqUnits={acqUnits}
      onChange={noop}
    />
  </IntlProvider>,
));

describe('AcqUnitFilter component', () => {
  afterEach(cleanup);

  it('should render all passed options', async () => {
    const { findAllByText } = renderAcqUnitFilter(acqUnitsRecords);

    const renderedFilterOptions = await findAllByText(/Unit #[0-9]/);

    expect(renderedFilterOptions.length).toBe(acqUnitsRecords.length);
  });
});
