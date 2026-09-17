import { useEffect } from 'react';

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
    expect(screen.getByTestId('visibility-container')).toHaveStyle({ display: 'contents' });
  });

  it('should render child component when explicitly visible', () => {
    renderComponent({ children: <span>{visibleText}</span>, visible: true });

    expect(screen.getByText(visibleText)).toBeVisible();
    expect(screen.getByTestId('visibility-container')).toHaveStyle({ display: 'contents' });
  });

  it('should hide child component', () => {
    renderComponent({ children: <span>{visibleText}</span>, visible: false });

    expect(screen.queryByText(visibleText)).not.toBeVisible();
    expect(screen.getByTestId('visibility-container')).toHaveStyle({ display: 'none' });
  });

  it('should preserve the mounted child while visibility changes', () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();
    const Child = () => {
      useEffect(() => {
        onMount();

        return onUnmount;
      }, []);

      return <span>{visibleText}</span>;
    };
    const { rerender, unmount } = renderComponent({ children: <Child />, visible: false });
    const child = screen.getByText(visibleText);

    rerender(<IfVisible visible><Child /></IfVisible>);

    expect(screen.getByText(visibleText)).toBe(child);
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).not.toHaveBeenCalled();

    rerender(<IfVisible visible={false}><Child /></IfVisible>);

    expect(screen.getByText(visibleText)).toBe(child);
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onUnmount).not.toHaveBeenCalled();

    unmount();
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });
});
