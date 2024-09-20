import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';

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
  it('should display passed label', () => {
    renderFieldLocationFinalContainer({ labelId: 'Location' });

    expect(screen.getByText(fieldLocationLabel)).toBeDefined();
  });

  it('should render options based on passed locationIds', async () => {
    renderFieldLocationFinalContainer();

    fireEvent.click(screen.getByText('stripes-components.selection.controlLabel'));

    const renderedLocationOptions = await screen.findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationsIds.length);
  });

  it('should render filtered options', async () => {
    renderFieldLocationFinalContainer({
      filterLocations: (records) => records.slice(0, 2),
    });

    fireEvent.click(screen.getByText('stripes-components.selection.controlLabel'));

    const renderedLocationOptions = await screen.findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions).toHaveLength(2);
  });
});
