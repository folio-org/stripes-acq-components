import { handleKeyCommand } from './handleKeyCommand';

const handler = jest.fn();
const e = { preventDefault: jest.fn() };

describe('handleKeyCommand', () => {
  beforeEach(() => {
    handler.mockClear();
  });

  it('should call handler', () => {
    handleKeyCommand(handler, false)(e);

    expect(handler).toHaveBeenCalled();
  });

  it('should not call handler', () => {
    handleKeyCommand(handler, true)(e);

    expect(handler).not.toHaveBeenCalled();
  });
});
