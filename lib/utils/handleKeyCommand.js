export const handleKeyCommand = (handler, disabled) => {
  return (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!disabled) {
      handler();
    }
  };
};
