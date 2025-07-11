import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { TextFilter } from './TextFilter';

const renderComponent = (props = {}) => (render(
  <TextFilter
    onChange={() => { }}
    labelId="text.filter"
    name="text-filter"
    id="text-filter"
    {...props}
  />,
));

describe('TextFilter', () => {
  it('should display TextFilter', async () => {
    renderComponent();
    expect(screen.getByText('text.filter')).toBeInTheDocument();
  });

  it('should call onChange', async () => {
    const onChange = jest.fn();

    renderComponent({ activeFilters: ['1'], onChange });

    await userEvent.type(screen.getByLabelText('text.filter'), '2');
    await waitFor(() => expect(onChange).toHaveBeenCalledWith({
      name: 'text-filter',
      values: ['12'],
    }));
  });
});
