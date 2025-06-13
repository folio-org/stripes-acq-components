import { useForm } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { VisibilityControl } from './VisibilityControl';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useForm: jest.fn(),
}));

// eslint-disable-next-line react/prop-types
const renderForm = ({ children, name }) => (
  <form>
    <VisibilityControl name={name}>
      {children}
    </VisibilityControl>
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} {...props} />
  </MemoryRouter>,
));

describe('VisibilityControl', () => {
  beforeEach(() => {
    useForm.mockReturnValue({ change: jest.fn(), getState: jest.fn().mockReturnValue({ values: {} }) });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderComponent({ name: 'test', children: 'test' });
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should render Filed component', async () => {
    const onChangeMock = jest.fn();

    useForm.mockReturnValue({
      change: onChangeMock,
      getState: jest.fn().mockReturnValue({ values: { hideAll: false } }),
    });

    renderComponent({ name: 'test', children: 'test' });
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(onChangeMock).toHaveBeenCalledWith('test', true);
  });
});
