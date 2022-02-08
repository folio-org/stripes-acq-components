import { useRef, useLayoutEffect } from 'react';

export const usePaneFocus = () => {
  const paneTitleRef = useRef();

  useLayoutEffect(() => {
    if (paneTitleRef.current) {
      paneTitleRef.current.focus();
    }
  }, []);

  return {
    paneTitleRef,
  };
};
