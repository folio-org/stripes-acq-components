import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import AcqUnitsViewContainer from './AcqUnitsViewContainer';
import AcqUnitsView from './AcqUnitsView';

const UNITS = [{ id: '1', name: 'unit 1' }];

jest.mock('./AcqUnitsView', () => {
  return jest.fn(() => 'AcqUnitsView');
});

const renderComponent = (props = {}) => (render(
  <AcqUnitsViewContainer
    {...props}
  />,
));

describe('AcqUnitsViewContainer', () => {
  beforeEach(() => {
    AcqUnitsView.mockClear();
  });

  it('should display AcqUnitsView', () => {
    renderComponent();
    expect(screen.getByText('AcqUnitsView')).toBeDefined();
  });

  it('should pass array of units to the child', async () => {
    const mutator = {
      acqUnitsView: {
        GET: jest.fn().mockResolvedValue(UNITS),
        reset: jest.fn(),
      },
    };

    renderComponent({ mutator, units: ['1'] });
    await waitFor(() => expect(AcqUnitsView.mock.calls[1][0].units).toEqual(UNITS));
  });
});
