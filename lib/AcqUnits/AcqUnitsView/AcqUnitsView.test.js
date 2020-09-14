import React from 'react';
import { render, screen } from '@testing-library/react';

import '../../../test/jest/__mock__';
import AcqUnitsView from './AcqUnitsView';

const ACQ_UNITS = [
  {
    id: 'e675b2eb-6847-4b4b-b6b4-879759f6ed61',
    name: 'Test unit',
    isDeleted: false,
  }, {
    id: 'e675b2eb-6847-4b4b-b6b4-879759f6ed62',
    name: 'Deleted unit',
    isDeleted: true,
  },
];

const renderAcqUnitsView = (units) => (render(
  <AcqUnitsView
    units={units}
  />,
));

describe('AcqUnitsView component', () => {
  it('should display NoValue', () => {
    renderAcqUnitsView();

    const unitsValue = screen.getByTestId('acqUnits').querySelector('[data-test-kv-value]');

    expect(unitsValue).toHaveTextContent('-');
  });

  it('should display acq units', () => {
    renderAcqUnitsView(ACQ_UNITS);

    const unitsValue = screen.getByTestId('acqUnits').querySelector('[data-test-kv-value]');

    expect(unitsValue).toHaveTextContent('Test unit');
    expect(unitsValue).toHaveTextContent('Deleted unit');
  });
});
