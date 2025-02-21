import { act } from 'react';

import user from '@testing-library/user-event';
import {
  render,
  screen,
} from '@testing-library/react';

import AuditLogChangedFieldsList from './AuditLogChangedFieldsList';

const fieldLabelsMap = {
  contributors: 'Contributors',
  statusId: 'Status id',
  statusUpdatedDate: 'Status updated date',
};

const defaultProps = {
  fieldChanges: [{
    fieldName: 'statusId',
    changeType: 'ADDED',
  }, {
    fieldName: 'statusUpdatedDate',
    changeType: 'MODIFIED',
  }, {
    fieldName: 'contributors',
    changeType: 'REMOVED',
  }],
  fieldLabelsMap,
  onChangeButtonClick: jest.fn(),
};

const renderAuditLogChangedFieldsList = ({
  ...props
} = {}) => render(
  <AuditLogChangedFieldsList
    {...defaultProps}
    {...props}
  />,
);

describe('AuditLogChangedFieldsList', () => {
  it('should render "Changed" as a button', () => {
    renderAuditLogChangedFieldsList();

    expect(screen.getByRole('button', { name: 'stripes-acq-components.versionHistory.card.changed' })).toBeInTheDocument();
  });

  it('should render list of changed fields', () => {
    renderAuditLogChangedFieldsList();

    expect(screen.getByText('Status id (stripes-acq-components.audit-log.action.added)')).toBeInTheDocument();
    expect(screen.getByText('Status updated date (stripes-acq-components.audit-log.action.edited)')).toBeInTheDocument();
    expect(screen.getByText('Contributors (stripes-acq-components.audit-log.action.removed)')).toBeInTheDocument();
  });

  it('should call \'onChangeButtonClick\' handler when \'Change\' button is clicked', async () => {
    renderAuditLogChangedFieldsList();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-acq-components.versionHistory.card.changed' })));

    expect(defaultProps.onChangeButtonClick).toHaveBeenCalled();
  });
});
