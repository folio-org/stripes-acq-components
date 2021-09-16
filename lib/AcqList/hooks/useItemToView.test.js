import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useLocalStorage } from '@rehooks/local-storage';

import { useItemToView } from './useItemToView';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: jest.fn(() => ['NameSpace']),
}));
jest.mock('@rehooks/local-storage', () => ({
  useLocalStorage: jest.fn(),
}));

const setItem = jest.fn();
const removeItem = jest.fn();

const MockComponent = () => {
  const { setItemToView, deleteItemToView } = useItemToView('test');

  const handleClick = (i) => {
    setItemToView({
      selector: `[aria-rowindex="${i}"]`,
      localClientTop: 50 * i,
    });
  };

  const rows = [];

  for (let i = 0; i < 3; i++) {
    rows.push(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        key={i}
        role="row"
        aria-rowindex={i}
        tabIndex={-1}
        onClick={() => handleClick(i)}
      >
        {i}
        <button
          type="button"
          onClick={deleteItemToView}
          data-testid={`delete-${i}`}
        >
          Delete
        </button>
      </div>,
    );
  }

  return (
    <div>
      {rows}
    </div>
  );
};

const renderComponent = (props = {}) => render(
  <MockComponent {...props} />,
);

describe('useItemToView', () => {
  beforeEach(() => {
    useLocalStorage.mockReturnValue([
      null,
      setItem,
      removeItem,
    ]);
  });

  it('should update storage with scroll data when a row was clicked', async () => {
    renderComponent();

    const row = await screen.findByText('2');

    user.click(row);
    expect(setItem).toHaveBeenCalledWith({ selector: '[aria-rowindex="2"]', localClientTop: 100 });
  });

  it('should delete item from storage when \'deleteItemToView\' was called', async () => {
    renderComponent();

    const deleteBtn = await screen.findByTestId('delete-2');

    user.click(deleteBtn);
    expect(removeItem).toHaveBeenCalled();
  });
});
