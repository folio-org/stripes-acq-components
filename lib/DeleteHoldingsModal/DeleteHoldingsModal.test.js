import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { DeleteHoldingsModal } from './DeleteHoldingsModal';

const defaultProps = {
  onCancel: jest.fn(),
  onKeepHoldings: jest.fn(),
  onConfirm: jest.fn(),
};

const renderDeleteHoldingsModal = (props = {}) => render(
  <DeleteHoldingsModal
    {...defaultProps}
    {...props}
  />,
);

describe('DeleteHoldingsModal', () => {
  it('should render delete holdings modal', () => {
    renderDeleteHoldingsModal();

    expect(screen.getAllByText('stripes-acq-components.holdings.deleteModal.heading')).toBeDefined();
    expect(screen.getByText('stripes-acq-components.holdings.deleteModal.keepHoldings')).toBeInTheDocument();
    expect(screen.getByText('stripes-acq-components.holdings.deleteModal.message')).toBeInTheDocument();
  });

  it('should call onCancel when cancel was clicked', async () => {
    renderDeleteHoldingsModal();

    const cancelBtn = await screen.findByText('stripes-core.button.cancel');

    user.click(cancelBtn);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onKeepHoldings when \'Keep holdings\' btn was clicked', async () => {
    renderDeleteHoldingsModal();

    const keepHoldingsBrn = await screen.findByText('stripes-acq-components.holdings.deleteModal.keepHoldings');

    user.click(keepHoldingsBrn);
    expect(defaultProps.onKeepHoldings).toHaveBeenCalled();
  });

  it('should call onConfirm when \'Delete holdings\' btn was clicked', async () => {
    renderDeleteHoldingsModal();

    const deleteBtn = await screen.findByRole('button', {
      name: 'stripes-acq-components.holdings.deleteModal.heading',
    });

    user.click(deleteBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
