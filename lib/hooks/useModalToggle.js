import { useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useModalToggle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return [isModalOpen, toggleModal];
};
