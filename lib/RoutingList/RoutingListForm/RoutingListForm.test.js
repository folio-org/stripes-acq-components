import { render, screen } from '@testing-library/react';
import { useHistory } from 'react-router';
import { MemoryRouter } from 'react-router-dom';

import {
  collapseAllSections,
  expandAllSections,
  HasCommand,
} from '@folio/stripes/components';

import RoutingListForm from './RoutingListForm';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

const onSubmitMock = jest.fn();

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = (props = {}) => (render(
  <RoutingListForm
    initialValues={{
      userIds: ['1'],
    }}
    onSubmit={onSubmitMock}
    {...props}
  />,
  { wrapper },
));

describe('RoutingListForm', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('stripes-acq-components.routing.list.generalInformation')).toBeDefined();
  });

  describe('shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      renderComponent();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderComponent();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should cancel form when cancel shortcut is called', () => {
      const pushMock = jest.fn();
      const onCancelMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderComponent({
        onCancel: onCancelMock,
      });
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(onCancelMock).toHaveBeenCalled();
    });
  });
});
