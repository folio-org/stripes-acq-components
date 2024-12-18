import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { dayjs } from '@folio/stripes/components';

import SendClaimsModal from './SendClaimsModal';

const FORMAT = 'MM/DD/YYYY';
const today = dayjs();

const defaultProps = {
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  open: true,
};

const renderSendClaimsModal = (props = {}) => render(
  <SendClaimsModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('SendClaimsModal', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onSubmit.mockClear();
  });

  it('should render send claim modal', () => {
    renderSendClaimsModal();

    expect(screen.getByText('ui-receiving.modal.sendClaim.heading')).toBeInTheDocument();
  });

  it('should validate "Claim expiry date" field', async () => {
    renderSendClaimsModal();

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.save' });

    await user.click(saveBtn);
    expect(screen.getByText('stripes-acq-components.validation.required')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(FORMAT), today.format(FORMAT));
    await user.click(saveBtn);
    expect(screen.getByText('ui-receiving.validation.dateAfter')).toBeInTheDocument();
  });

  it('should submit valid form', async () => {
    renderSendClaimsModal();

    const date = today.add(5, 'days');
    const internalNote = 'Internal';
    const externalNote = 'External';

    await user.type(screen.getByPlaceholderText(FORMAT), date.format(FORMAT));
    await user.type(screen.getByLabelText('ui-receiving.piece.internalNote'), internalNote);
    await user.type(screen.getByLabelText('ui-receiving.piece.externalNote'), externalNote);
    await user.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.save' }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      {
        claimingDate: date.format('YYYY-MM-DD'),
        internalNote,
        externalNote,
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should call "onCancel" when the modal dismissed', async () => {
    renderSendClaimsModal();

    await user.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' }));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
