jest.mock('@rehooks/local-storage', () => ({
  useLocalStorage: jest.fn(),
  writeStorage: jest.fn(),
  deleteFromStorage: jest.fn(),
}));
