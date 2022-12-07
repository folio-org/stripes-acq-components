import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';

import { VersionHistoryPane } from './VersionHistoryPane';

const defaultProps = {
  id: 'order',
  onClose: jest.fn(),
  versions: [{}],
};

const renderVersionHistoryPane = (props = {}) => (render(
  <VersionHistoryPane
    {...defaultProps}
    {...props}
  />,
));

describe('VersionHistoryPane', () => {
  beforeEach(() => {
    defaultProps.onClose.mockClear();
  });

  it('should display version history pane', () => {
    renderVersionHistoryPane();

    expect(screen.getByText('stripes-acq-components.versionHistory.pane.header')).toBeInTheDocument();
  });

  it('should call \'onClose\' handler when \'Close\' icon button was clicked', async () => {
    renderVersionHistoryPane();

    await act(async () => user.click(screen.getByRole('button', { name: 'stripes-components.closeItem' })));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
