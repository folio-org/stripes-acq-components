import { render, cleanup, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Form } from 'react-final-form';

import FieldLocationFinal from './FieldLocationFinal';

const locationOptions = [
  { value: '001', label: 'Location #1' },
  { value: '002', label: 'Location #2' },
  { value: '003', label: 'Location #3' },
];

const fieldLocationLabel = 'Location';

const defaultProps = {
  name: 'locationId',
  locationsForSelect: locationOptions,
  selectLocationFromPlugin: jest.fn(),
  required: true,
  isDisabled: false,
};

const renderFieldLocationFinal = (props = {}, formProps = {}) => render(
  <Form
    onSubmit={jest.fn()}
    {...formProps}
    render={() => (
      <FieldLocationFinal
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldLocationFinal component', () => {
  afterEach(cleanup);

  it('should display passed label', () => {
    renderFieldLocationFinal({ labelId: 'Location' });

    expect(screen.getByText(fieldLocationLabel)).toBeDefined();
  });

  it('should render all passed options', async () => {
    renderFieldLocationFinal();

    const button = screen.getByText('stripes-components.selection.controlLabel');

    await user.click(button);

    const renderedLocationOptions = await screen.findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationOptions.length);
  });
});
