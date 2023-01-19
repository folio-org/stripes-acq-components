import { useCallback, useState } from 'react';

export const useToggle = (defaultState) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return [isOpen, toggle];
};
