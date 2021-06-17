// TODO: check if it can be totally removed
global.document.originalCreateRange = global.document.createRange;

global.document.mockCreateRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

global.document.createRange = global.document.mockCreateRange;
