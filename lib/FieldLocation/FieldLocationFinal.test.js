import { Form } from 'react-final-form';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display passed label', () => {
    renderFieldLocationFinal({ labelId: 'Location' });

    expect(screen.getByText(fieldLocationLabel)).toBeInTheDocument();
  });

  it('should render all passed options', async () => {
    renderFieldLocationFinal();

    await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));

    const renderedLocationOptions = await screen.findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationOptions.length);
  });
});
