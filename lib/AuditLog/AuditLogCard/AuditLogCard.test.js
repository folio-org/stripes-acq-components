import {
  render,
  screen,
} from '@testing-library/react';

import AuditLogCard from './AuditLogCard';

const fieldLabelsMap = {
  contributors: 'Contributors',
  statusId: 'Status id',
  statusUpdatedDate: 'Status updated date',
};

const fieldFormatter = {
  statusId: () => 'status_id',
};

const defaultProps = {
  date: '2025-02-21T16:18:49.201+00:00',
  fieldLabelsMap,
  fieldFormatter,
  diff: {
    fieldChanges: [{
      fieldName: 'statusId',
      changeType: 'ADDED',
      newValue: 'newValue1',
      oldValue: 'oldValue1',
    }],
    collectionChanges: [],
  },
};

const renderAuditLogCard = ({
  ...props
} = {}) => render(
  <AuditLogCard
    {...defaultProps}
    {...props}
  />,
);

describe('AuditLogCard', () => {
  it('should render card', () => {
    renderAuditLogCard();

    expect(screen.getByText('2025-02-21T16:18:49.201+00:00')).toBeInTheDocument();
    expect(screen.getByText('stripes-components.metaSection.source')).toBeInTheDocument();
  });

  it('should render changed fields', () => {
    renderAuditLogCard();

    expect(screen.getByText('stripes-acq-components.versionHistory.card.changed')).toBeInTheDocument();
    expect(screen.getByText('Status id (stripes-acq-components.audit-log.action.added)')).toBeInTheDocument();
  });

  it('should render collection of changed fields', () => {
    renderAuditLogCard({
      diff: {
        fieldChanges: [],
        collectionChanges: [{
          collectionName: 'contributors',
          itemChanges: [{
            changeType: 'ADDED',
            newValue: {
              name: 'name 1',
              contributorTypeId: '94e6a5a8-b84f-44f7-b900-71cd10ea954e',
            },
          }],
        }],
      },
    });

    expect(screen.getByText('stripes-acq-components.versionHistory.card.changed')).toBeInTheDocument();
    expect(screen.getByText('Contributors (stripes-acq-components.audit-log.action.added)')).toBeInTheDocument();
  });
});
