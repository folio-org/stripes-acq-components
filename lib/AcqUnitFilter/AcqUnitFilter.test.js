import noop from 'lodash/noop';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import AcqUnitFilter from './AcqUnitFilter';

const acqUnitsRecords = [
  { name: 'Unit #1', id: '001' },
  { name: 'Unit #2', id: '002' },
];

const renderAcqUnitFilter = (acqUnits) => (render(
  <AcqUnitFilter
    id="acqUnits"
    labelId="acqUnits"
    name="acqUnits"
    acqUnits={acqUnits}
    onChange={noop}
  />,
));

describe('AcqUnitFilter component', () => {
  it('should render all passed options', async () => {
    const { findAllByText, getByText } = renderAcqUnitFilter(acqUnitsRecords);

    await userEvent.click(getByText('stripes-components.selection.controlLabel'));

    const renderedFilterOptions = await findAllByText(/Unit #[0-9]/);

    expect(renderedFilterOptions.length).toBe(acqUnitsRecords.length);
  });
});
