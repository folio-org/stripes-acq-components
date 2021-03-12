import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AcqUnitsField from './AcqUnitsField';
import AcqUnitsFieldContainer from './AcqUnitsFieldContainer';

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

jest.mock('./AcqUnitsField', () => {
  return jest.fn(() => 'AcqUnitsField');
});

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <AcqUnitsFieldContainer
      id="units"
      name="units"
      {...props}
    />
  </MemoryRouter>,
));

describe('AcqUnitsFieldContainer', () => {
  const mutator = {
    acqUnitMemberships: {
      GET: jest.fn().mockResolvedValue(MEMBERSHIP),
      reset: jest.fn(),
    },
    acqUnitsEdit: {
      GET: jest.fn().mockResolvedValue(UNITS),
      reset: jest.fn(),
    },
  };

  beforeEach(() => {
    AcqUnitsField.mockClear();
  });

  it('should load and pass units', async () => {
    const preselectedUnits = ['1ed3cc28-c0da-423e-b9d4-5b9917b2fa69'];

    renderComponent({ mutator, preselectedUnits });
    await waitFor(() => expect(AcqUnitsField.mock.calls[1][0].units).toEqual(UNITS));
  });
});
