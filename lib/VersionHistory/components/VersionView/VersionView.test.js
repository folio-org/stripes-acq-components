import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import VersionView from './VersionView';

jest.mock('../../../hooks/useTags', () => ({
  useTagsConfigs: jest.fn(() => ({ configs: [] })),
}));

const defaultProps = {
  children: <div>Version Content</div>,
  id: 'test-id',
  isLoading: false,
  onClose: jest.fn(),
  tags: [{ id: 'tag1' }, { id: 'tag2' }],
  versionId: 'version1',
  dismissible: true,
};

const renderComponent = (props = {}) => render(
  <VersionView
    {...defaultProps}
    {...props}
  />,
);

describe('VersionView', () => {
  it('should render loading pane when isLoading is true', () => {
    renderComponent({ isLoading: true });

    expect(screen.queryByText('Version Content')).not.toBeInTheDocument();
  });

  it('should render children when version exists and is not loading', () => {
    renderComponent();

    expect(screen.getByText('Version Content')).toBeInTheDocument();
  });

  it('should render no version message when version does not exist', () => {
    renderComponent({ versionId: null });

    expect(screen.getByText('stripes-acq-components.versionHistory.noVersion')).toBeInTheDocument();
  });

  it('should call onClose when Pane onClose is triggered', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-components.closeItem' }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
