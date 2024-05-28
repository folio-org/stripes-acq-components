import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { useForm } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

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
  it('should render component', () => {
    renderComponent({ name: 'test', children: 'test' });
    expect(screen.getByText('test')).toBeDefined();
  });

  it('should render Filed component', async () => {
    const onChangeMock = jest.fn();

    useForm.mockReturnValue({
      change: onChangeMock,
      getState: jest.fn().mockReturnValue({ values: { hideAll: false } }),
    });

    renderComponent({ name: 'test', children: 'test' });
    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);
    expect(screen.getByText('test')).toBeDefined();
    expect(onChangeMock).toHaveBeenCalledWith('test', true);
  });
});
