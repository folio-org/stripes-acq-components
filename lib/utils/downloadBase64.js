// eslint-disable-next-line import/prefer-default-export
export const downloadBase64 = (name, base64String) => {
  const elem = window.document.createElement('a');

  elem.href = base64String;
  elem.download = name;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
};
