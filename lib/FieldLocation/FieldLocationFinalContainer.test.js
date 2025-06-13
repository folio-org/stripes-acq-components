import { Form } from 'react-final-form';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import FieldLocationFinalContainer from './FieldLocationFinalContainer';

const locationsList = [
  { id: '001', name: 'Location #1' },
  { id: '002', name: 'Location #2' },
  { id: '003', name: 'Location #3' },
];
const locationsIds = ['001', '002'];
const fieldLocationLabel = 'Location';

const defaultProps = {
  name: 'locationId',
  prepopulatedLocationsIds: locationsIds,
  locationsForDict: locationsList,
  onChange: jest.fn(),
};

const renderFieldLocationFinalContainer = (props = {}, formProps = {}) => (render(
  <Form
    onSubmit={jest.fn()}
    {...formProps}
    render={() => (
      <FieldLocationFinalContainer
        {...defaultProps}
        {...props}
      />
    )}
  />,
));

describe('FieldLocationFinalContainer component', () => {
  it('should display passed label', async () => {
    renderFieldLocationFinalContainer({ labelId: 'Location' });

    const button = screen.getByText('stripes-components.selection.controlLabel');

    await userEvent.click(button);

    expect(screen.getByText(fieldLocationLabel)).toBeInTheDocument();
  });

  it('should render options based on passed locationIds', async () => {
    renderFieldLocationFinalContainer();

    const button = screen.getByText('stripes-components.selection.controlLabel');

    await userEvent.click(button);

    const renderedLocationOptions = await screen.findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationsIds.length);
  });

  it('should render filtered options', async () => {
    renderFieldLocationFinalContainer({
      filterLocations: (records) => records.slice(0, 2),
    });

    const button = screen.getByText('stripes-components.selection.controlLabel');

    await userEvent.click(button);

    const renderedLocationOptions = await screen.findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions).toHaveLength(2);
  });
});
