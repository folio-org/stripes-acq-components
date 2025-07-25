import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import { useModalToggle } from './useModalToggle';

describe('useModalToggle', () => {
  it('should return initial falsy value', () => {
    const { result } = renderHook(() => useModalToggle());

    const [isModalOpen] = result.current;

    expect(isModalOpen).toBeFalsy();
  });

  it('should change value to opposite when toggleModal is called', () => {
    const { result } = renderHook(() => useModalToggle());

    const [, toggleModal] = result.current;

    act(() => {
      toggleModal();
    });

    expect(result.current[0]).toBeTruthy();
  });
});
