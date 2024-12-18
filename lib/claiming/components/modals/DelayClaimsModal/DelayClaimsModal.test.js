/* Developed collaboratively using AI (GitHub Copilot) */

import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { dayjs } from '@folio/stripes/components';

import DelayClaimsModal from './DelayClaimsModal';

const FORMAT = 'MM/DD/YYYY';
const today = dayjs();

const defaultProps = {
  claimsCount: 1,
  onSubmit: jest.fn(() => console.log('')),
  message: 'Test message',
  onCancel: jest.fn(),
  open: true,
};

const renderComponent = (props = {}) => render(
  <DelayClaimsModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('DelayClaimsModal', () => {
  it('should call onCancel when cancel button is clicked', async () => {
    renderComponent();

    await userEvent.click(screen.getByText('stripes-acq-components.FormFooter.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should validate "Delay to" field and call onSubmit when save button is clicked', async () => {
    renderComponent();

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.save' });

    /* Empty input */
    await userEvent.click(saveBtn);

    expect(screen.getByText('stripes-acq-components.validation.required')).toBeInTheDocument();

    /* Invalid date input */
    await userEvent.type(screen.getByPlaceholderText(FORMAT), today.format(FORMAT));
    await userEvent.click(saveBtn);

    expect(screen.getByText('stripes-acq-components.validation.dateAfter')).toBeInTheDocument();

    /* Valid date */
    await userEvent.clear(screen.getByPlaceholderText(FORMAT));
    await userEvent.type(screen.getByPlaceholderText(FORMAT), dayjs().add(5, 'days').format(FORMAT));
    await userEvent.click(saveBtn);

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
