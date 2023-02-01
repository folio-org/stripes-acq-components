import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { cloneDeep, set } from 'lodash';

import { orderLineAuditEvent } from '../../../test/jest/fixtures';
import { useUsersBatch } from '../../hooks';
import { VersionViewContextProvider } from '../VersionViewContext';
import VersionHistoryPane from './VersionHistoryPane';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useUsersBatch: jest.fn(() => ({ users: [], isLoading: false })),
}));

const TEST_ID = 'testId';

const poLineLabelsMap = {
  'fundDistribution': 'ui-orders.line.accordion.fund',
  'fundDistribution[\\d]': 'ui-orders.line.accordion.fund',
  'fundDistribution[\\d].fundId': 'stripes-acq-components.fundDistribution.name',
  'fundDistribution[\\d].code': 'stripes-acq-components.fundDistribution.name',
  'fundDistribution[\\d].expenseClassId': 'stripes-acq-components.fundDistribution.expenseClass',
  'fundDistribution[\\d].value': 'stripes-acq-components.fundDistribution.value',
  'fundDistribution[\\d].distributionType': 'stripes-acq-components.fundDistribution.value',
  'fundDistribution[\\d].encumbrance': 'stripes-acq-components.fundDistribution.currentEncumbrance',
};

const defaultProps = {
  currentVersion: TEST_ID,
  labelsMap: poLineLabelsMap,
  id: 'orderLineVersions',
  onClose: jest.fn(),
  onSelectVersion: jest.fn(),
};

const renderVersionHistoryPane = ({
  snapshotPath = 'orderLineSnapshot',
  versionId,
  versions = [],
  ...props
} = {}) => render(
  <VersionViewContextProvider
    snapshotPath={snapshotPath}
    versionId={versionId}
    versions={versions}
  >
    <VersionHistoryPane
      {...defaultProps}
      {...props}
      versions={versions}
    />
  </VersionViewContextProvider>,
);

describe('VersionHistoryPane', () => {
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

    renderVersionHistoryPane();

    expect(screen.queryByText('stripes-acq-components.versionHistory.pane.sub')).not.toBeInTheDocument();
  });

  it('should display version history pane', () => {
    renderVersionHistoryPane();

    expect(screen.getByText('stripes-acq-components.versionHistory.pane.header')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.versionHistory.pane.sub')).toBeInTheDocument();
  });

  it('should display version history cards', () => {
    const clonedAuditEvent = Object.assign(cloneDeep(orderLineAuditEvent), { id: TEST_ID });

    set(clonedAuditEvent.orderLineSnapshot, 'fundDistribution[0].value', 50);
    set(clonedAuditEvent.orderLineSnapshot, 'fundDistribution[1]', {
      code: 'Fund code',
      fundId: 'fundId',
      distributionType: 'percentage',
      value: 50,
    });

    renderVersionHistoryPane({
      versions: [clonedAuditEvent, orderLineAuditEvent],
    });

    // Changed fields
    expect(screen.getByText('stripes-acq-components.versionHistory.card.changed')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.fundDistribution.value')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.line.accordion.fund')).toBeInTheDocument();
  });

  it('should not display version cards without changed fields', () => {
    const clonedAuditEvent = Object.assign(cloneDeep(orderLineAuditEvent), { id: TEST_ID });

    set(clonedAuditEvent.orderLineSnapshot, 'fundDistribution[0].value', 50);

    renderVersionHistoryPane({
      versions: [
        { ...clonedAuditEvent, id: 'qwerty-1' },
        { ...clonedAuditEvent, id: 'qwerty-2' },
        clonedAuditEvent,
        orderLineAuditEvent,
      ],
    });

    const versionCards = screen.getAllByText('stripes-acq-components.versionHistory.card.select.tooltip');

    expect(versionCards.length).toEqual(2);
  });

  it('should display \'Original version\' label for the first version', async () => {
    renderVersionHistoryPane({ versions: [orderLineAuditEvent] });

    expect(screen.getByText('stripes-acq-components.versionHistory.card.version.original')).toBeInTheDocument();
  });

  it('should call \'onClose\' handler when \'Close\' icon button was clicked', async () => {
    renderVersionHistoryPane();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-components.closeItem' })));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
