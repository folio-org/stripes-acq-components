import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useShowCallout } from '../../hooks';
import { UNIQUE_NAME_ERROR_CODE } from '../constants';
import { useRoutingListMutation } from '../hooks';
import { RoutingListCreate } from './RoutingListCreate';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useShowCallout: jest.fn(),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

const mockCreateMocking = jest.fn().mockResolvedValue({
  then: jest.fn(),
});

jest.mock('../hooks', () => ({
  useRoutingListMutation: jest.fn(),
  useGoBack: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => render(
  <RoutingListCreate fallbackPath="/receiving" />,
  { wrapper },
);

describe('RoutingListCreate', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    useRoutingListMutation.mockReturnValue({
      createRoutingList: mockCreateMocking,
      isCreating: false,
    });
    useShowCallout.mockReturnValue(showCalloutMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.name')).toBeDefined();
  });

  it('should update routing list name', async () => {
    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'stripes-acq-components.routing.list.name' });

    await userEvent.type(nameInput, 'test');

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await userEvent.click(saveBtn);

    expect(mockCreateMocking).toHaveBeenCalled();
  });

  it('should return error message when create routing list failed', async () => {
    const createRoutingList = jest.fn().mockRejectedValue({
      response: {
        json: jest.fn().mockResolvedValue({
          errors: [{ code: UNIQUE_NAME_ERROR_CODE }],
        }),
      },
    });

    useRoutingListMutation.mockReturnValue({
      createRoutingList,
    });

    renderComponent();

    const nameInput = screen.getByRole('textbox', { name: 'stripes-acq-components.routing.list.name' });

    await userEvent.type(nameInput, 'test 2');

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.routing.list.create.paneMenu.save' });

    expect(saveBtn).toBeEnabled();

    await userEvent.click(saveBtn);

    expect(createRoutingList).toHaveBeenCalled();
  });
});
