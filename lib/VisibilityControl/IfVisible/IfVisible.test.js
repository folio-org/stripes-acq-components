import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import IfVisible from './IfVisible';

const visibleText = 'Visible';

const renderComponent = (props = {}) => render(
  <IfVisible {...props} />,
);

describe('IfVisible', () => {
  it('should render child component', () => {
    renderComponent({ children: <span>{visibleText}</span> });

    expect(screen.queryByText(visibleText)).toBeVisible();
  });

  it('should hide child component', () => {
    renderComponent({ children: <span>{visibleText}</span>, visible: false });

    expect(screen.queryByText(visibleText)).not.toBeVisible();
  });
});
