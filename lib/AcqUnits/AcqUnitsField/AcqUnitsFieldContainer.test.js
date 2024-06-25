import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useAcquisitionUnits } from '../../hooks';
import { useAcqUnitsMemberships } from '../hooks';
import AcqUnitsField from './AcqUnitsField';
import AcqUnitsFieldContainer from './AcqUnitsFieldContainer';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAcquisitionUnits: jest.fn(),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useAcqUnitsMemberships: jest.fn(),
}));
jest.mock('./AcqUnitsField', () => {
  return jest.fn(() => 'AcqUnitsField');
});

const MEMBERSHIP = [{
  'id': '3b552ce3-da49-49be-a1f8-a7a6617f16cc',
  'userId': 'e5e96ab2-694f-5222-b616-34befa6125bb',
  'acquisitionsUnitId': '1ed3cc28-c0da-423e-b9d4-5b9917b2fa69',
}];
const UNITS = [{
  'id': '1ed3cc28-c0da-423e-b9d4-5b9917b2fa69',
  'name': 'test',
  'isDeleted': false,
  'protectCreate': true,
  'protectRead': false,
  'protectUpdate': true,
  'protectDelete': true,
}];

const defaultProps = {
  id: 'units',
  name: 'units',
};

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <AcqUnitsFieldContainer
      {...defaultProps}
      {...props}
    />
  </MemoryRouter>,
));

describe('AcqUnitsFieldContainer', () => {
  beforeEach(() => {
    AcqUnitsField.mockClear();
    useAcquisitionUnits
      .mockClear()
      .mockReturnValue({ acquisitionsUnits: UNITS });
    useAcqUnitsMemberships
      .mockClear()
      .mockReturnValue({ acquisitionsUnitMemberships: MEMBERSHIP });
  });

  it('should load and pass units', () => {
    const preselectedUnits = ['1ed3cc28-c0da-423e-b9d4-5b9917b2fa69'];

    renderComponent({ preselectedUnits });

    expect(AcqUnitsField.mock.calls[0][0].units).toEqual(UNITS);
  });
});
