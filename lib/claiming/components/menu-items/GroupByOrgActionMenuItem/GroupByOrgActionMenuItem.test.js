import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GroupByOrgActionMenuItem } from './GroupByOrgActionMenuItem';

const defaultProps = {
  onClick: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <GroupByOrgActionMenuItem
    {...defaultProps}
    {...props}
  />,
);

describe('GroupByOrgActionMenuItem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button', () => {
    renderComponent();

    expect(screen.getByTestId('group-by-org-button')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    renderComponent();

    await userEvent.click(screen.getByTestId('group-by-org-button'));

    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
