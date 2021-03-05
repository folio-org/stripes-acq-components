import { useState } from 'react';

export const useToggle = (defaultState) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const toggle = () => setIsOpen(!isOpen);

  return [isOpen, toggle];
};
