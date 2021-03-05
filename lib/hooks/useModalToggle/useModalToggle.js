import { useCallback, useState } from 'react';

export const useModalToggle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = useCallback(() => setIsModalOpen(prevIsModalOpen => !prevIsModalOpen), []);

  return [isModalOpen, toggleModal];
};
