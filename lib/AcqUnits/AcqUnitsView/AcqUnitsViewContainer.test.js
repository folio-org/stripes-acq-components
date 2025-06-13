import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { useAcquisitionUnits } from '../../hooks';
import AcqUnitsViewContainer from './AcqUnitsViewContainer';
import AcqUnitsView from './AcqUnitsView';

const UNITS = [{ id: '1', name: 'unit 1' }];

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAcquisitionUnits: jest.fn(),
}));
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
    useAcquisitionUnits.mockReturnValue({ acquisitionsUnits: UNITS });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display AcqUnitsView', () => {
    renderComponent();

    expect(screen.getByText('AcqUnitsView')).toBeDefined();
  });

  it('should pass array of units to the child', async () => {
    renderComponent({ units: ['1'] });

    await waitFor(() => expect(AcqUnitsView.mock.calls[0][0].units).toEqual(UNITS));
  });
});
