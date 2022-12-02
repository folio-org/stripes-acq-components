import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';

import { VersionHistoryButton } from './VersionHistoryButton';

const defaultProps = {
  onClick: jest.fn(),
};

const renderVersionHistoryButton = (props = {}) => (render(
  <VersionHistoryButton
    {...defaultProps}
    {...props}
  />,
));

describe('VersionHistoryButton', () => {
  beforeEach(() => {
    defaultProps.onClick.mockClear();
  });

  it('should display version history button', () => {
    renderVersionHistoryButton();

    expect(screen.getByRole('button', { name: 'stripes-acq-components.versionHistory.pane.header' })).toBeInTheDocument();
  });

  it('should call \'onClick\' handler when button was clicked', async () => {
    renderVersionHistoryButton();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-acq-components.versionHistory.pane.header' })));

    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
