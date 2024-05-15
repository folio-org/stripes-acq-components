import { useCallback, useState } from 'react';

export const useToggle = (defaultState) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const toggle = useCallback(() => setIsOpen((prevState) => !prevState), []);

  return [isOpen, toggle];
};
