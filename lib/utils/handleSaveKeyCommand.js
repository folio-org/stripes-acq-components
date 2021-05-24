export const handleSaveKeyCommand = (e, handleSubmit, pristine, submitting) => {
  e.preventDefault();

  if (!pristine && !submitting) {
    handleSubmit();
  }
};
