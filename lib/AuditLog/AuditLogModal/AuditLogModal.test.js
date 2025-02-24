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

  describe('when oldValue and newValue are strings', () => {
    it('should format content correctly', () => {
      renderAuditLogModal({
        contentData: [{
          changeType: 'MODIFIED',
          fieldName: 'field1',
          oldValue: 'a',
          newValue: 'b',
        }],
      });

      expect(screen.getByText('stripes-acq-components.audit-log.action.edited')).toBeInTheDocument();
      expect(screen.getByText('field1')).toBeInTheDocument();
      expect(screen.getByText('a')).toBeInTheDocument();
      expect(screen.getByText('b')).toBeInTheDocument();
    });
  });

  describe('when oldValue and newValue are objects', () => {
    it('should format content correctly', () => {
      renderAuditLogModal({
        contentData: [{
          changeType: 'REMOVED',
          fieldName: 'field2',
          oldValue: { a: 'oldValueA' },
          newValue: { a: 'newValueA' },
        }],
      });

      expect(screen.getByText('stripes-acq-components.audit-log.action.removed')).toBeInTheDocument();
      expect(screen.getByText('field2')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('oldValueA')).toBeInTheDocument();
      expect(screen.getByText('newValueA')).toBeInTheDocument();
    });
  });

  describe('when oldValue is empty', () => {
    it('should format content correctly', () => {
      renderAuditLogModal({
        contentData: [{
          changeType: 'ADDED',
          fieldName: 'field3',
          newValue: 'c',
        }],
      });

      expect(screen.getByText('stripes-acq-components.audit-log.action.added')).toBeInTheDocument();
      expect(screen.getByText('field3')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('c')).toBeInTheDocument();
    });
  });
});
