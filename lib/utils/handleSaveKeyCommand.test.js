import { handleSaveKeyCommand } from './handleSaveKeyCommand';

const handleSubmit = jest.fn();
const e = { preventDefault: jest.fn() };

describe('handleSaveKeyCommand', () => {
  beforeEach(() => {
    handleSubmit.mockClear();
  });

  it('should call handleSubmit', () => {
    handleSaveKeyCommand(e, handleSubmit, false, false);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should not call handleSubmit', () => {
    handleSaveKeyCommand(e, handleSubmit, true, false);

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
