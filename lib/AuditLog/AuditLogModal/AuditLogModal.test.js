import { act } from 'react';

import {
  render,
  screen,
} from '@testing-library/react';
import user from '@testing-library/user-event';

import AuditLogModal from './AuditLogModal';

const fieldLabelsMap = {
  contributors: 'Contributors',
  statusId: 'Status id',
  statusUpdatedDate: 'Status updated date',
};
const fieldFormatter = {
  statusId: () => 'status_id',
};

const defaultProps = {
  contentData: [{}],
  label: 'user name and date',
  open: true,
  onClose: jest.fn(),
  fieldLabelsMap,
  fieldFormatter,
};

const renderAuditLogModal = ({
  ...props
} = {}) => render(
  <AuditLogModal
    {...defaultProps}
    {...props}
  />,
);

describe('AuditLogModal', () => {
  it('should render header', () => {
    renderAuditLogModal();

    expect(screen.getByText('user name and date')).toBeInTheDocument();
  });

  it('should render "Close" button in footer', () => {
    renderAuditLogModal();

    expect(screen.getByRole('button', { name: 'stripes-acq-components.button.close' })).toBeInTheDocument();
  });

  it('should call \'onClose\' handler when "Close" button is clicked', async () => {
    renderAuditLogModal();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-acq-components.button.close' })));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should render correct table columns', () => {
    renderAuditLogModal();

    expect(screen.getByText('stripes-acq-components.audit-log.modal.action')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.audit-log.modal.field')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.audit-log.modal.changedFrom')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.audit-log.modal.changedTo')).toBeInTheDocument();
  });
});
