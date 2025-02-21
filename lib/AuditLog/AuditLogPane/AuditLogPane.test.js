import { act } from 'react';
import user from '@testing-library/user-event';
import {
  render,
  screen,
} from '@testing-library/react';

import AuditLogPane from './AuditLogPane';

import { useUsersBatch } from '../../hooks';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useUsersBatch: jest.fn(() => ({ users: [], isLoading: false })),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: () => <span>LoadingPane</span>,
}));

const fieldLabelsMap = {
  contributors: 'Contributors',
  statusId: 'Status id',
  statusUpdatedDate: 'Status updated date',
};

const defaultProps = {
  onClose: jest.fn(),
  fieldLabelsMap,
  isLoading: false,
};

const renderAuditLogPane = ({
  versions = [],
  ...props
} = {}) => render(
  <AuditLogPane
    {...defaultProps}
    {...props}
    versions={versions}
  />,
);

describe('AuditLogPane', () => {
  beforeEach(() => {
    defaultProps.onClose.mockClear();
    useUsersBatch.mockClear().mockReturnValue({
      users: [{
        id: 'a7d92b0c-1bb6-4a0e-adcd-3c6dbf2d32b8',
        personal: { firstName: 'Test', lastName: 'User' },
      }],
      isLoading: false,
    });
  });

  it('should display loading pane if references are loading', () => {
    useUsersBatch.mockReturnValue({ users: [], isLoading: true });

    renderAuditLogPane();

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
    expect(screen.queryByText('stripes-acq-components.versionHistory.pane.sub')).not.toBeInTheDocument();
  });

  it('should display loading pane if versions are loading', () => {
    renderAuditLogPane({ isLoading: true });

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
    expect(screen.queryByText('stripes-acq-components.versionHistory.pane.sub')).not.toBeInTheDocument();
  });

  it('should display version history pane', () => {
    renderAuditLogPane();

    expect(screen.getByText('stripes-acq-components.versionHistory.pane.header')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.versionHistory.pane.sub')).toBeInTheDocument();
  });

  it('should display version history cards', () => {
    renderAuditLogPane({
      versions: [{
        action: 'UPDATE',
        diff: {
          fieldChanges: [{
            fieldName: 'statusId',
            changeType: 'ADDED',
            newValue: 'newValue1',
            oldValue: 'oldValue1',
          }],
          collectionChanges: [],
        },
        eventDate: '2025-02-21T16:18:49.201+00:00',
      }],
    });

    expect(screen.getByText('stripes-acq-components.versionHistory.card.changed')).toBeInTheDocument();
    expect(screen.getByText('Status id (stripes-acq-components.audit-log.action.added)')).toBeInTheDocument();
  });

  it('should not display a card with action "CREATE"', () => {
    renderAuditLogPane({
      versions: [{
        action: 'CREATE',
        diff: {
          fieldChanges: [{
            fieldName: 'fieldName1',
            changeType: 'ADDED',
            newValue: 'newValue1',
            oldValue: 'oldValue1',
          }],
          collectionChanges: [],
        },
        eventDate: '2025-02-21T16:18:49.201+00:00',
      }, {
        action: 'UPDATE',
        diff: {
          fieldChanges: [{
            fieldName: 'statusId',
            changeType: 'ADDED',
            newValue: 'newValue2',
            oldValue: 'oldValue2',
          }],
          collectionChanges: [],
        },
        eventDate: '2025-02-21T16:18:49.201+00:00',
      }],
    });

    expect(screen.queryByText('fieldName1')).not.toBeInTheDocument();
  });

  it('should call \'onClose\' handler when \'Close\' icon button is clicked', async () => {
    renderAuditLogPane();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-components.closeItem' })));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
