import { handleKeyCommand } from './handleKeyCommand';

const handler = jest.fn();
const e = { preventDefault: jest.fn() };

describe('handleKeyCommand', () => {
  beforeEach(() => {
    handler.mockClear();
  });

  it('should call handler', () => {
    handleKeyCommand(handler, { disabled: false })(e);

    expect(handler).toHaveBeenCalled();
  });

  it('should not call handler', () => {
    handleKeyCommand(handler, { disabled: true })(e);

    expect(handler).not.toHaveBeenCalled();
  });
});
