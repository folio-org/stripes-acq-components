import React from 'react';
import { render } from '@testing-library/react';

import { usePaneFocus } from './usePaneFocus';

// eslint-disable-next-line react/prop-types
const TestPaneFocusHook = ({ focusCb }) => {
  const { paneTitleRef } = usePaneFocus();

  paneTitleRef.current = {
    focus: focusCb,
  };

  return 'TestPaneFocusHook';
};

const renderTestList = (focusCb) => render(
  <TestPaneFocusHook focusCb={focusCb} />,
);

describe('usePaneFocus', () => {
  it('should call focus after mount', () => {
    const focusCb = jest.fn();

    renderTestList(focusCb);

    expect(focusCb).toHaveBeenCalled();
  });
});
