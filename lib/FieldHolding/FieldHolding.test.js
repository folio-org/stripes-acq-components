import keyBy from 'lodash/keyBy';
import { Form } from 'react-final-form';

import {
  render,
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useInstanceHoldings } from '../hooks';
import { FieldHolding } from './FieldHolding';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useInstanceHoldings: jest.fn(),
}));

const locations = [
  { name: 'Location #1', code: '', id: '001' },
  { name: 'Location #2', code: '', id: '002' },
];
const holdings = [
  { id: '01', permanentLocationId: '001' },
  { id: '02', permanentLocationId: '002' },
];
const holdingLabel = 'Holding';

const defaultProps = {
  isDisabled: false,
  onChange: jest.fn(),
  locationsForDict: locations,
  required: false,
  locationLabelId: 'Location',
  locationFieldName: 'locationId',
  name: 'holdingId',
  instanceId: 'instanceId',
};

const renderFieldHolding = (props = {}, formProps = {}) => (render(
  <Form
    onSubmit={jest.fn()}
    {...formProps}
    render={() => (
      <FieldHolding
        {...defaultProps}
        {...props}
      />
    )}
  />,
));

describe('FieldHolding component', () => {
  beforeEach(() => {
    useInstanceHoldings.mockReturnValue({ holdings });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display label', () => {
    const { getByText } = renderFieldHolding({ labelId: holdingLabel });

    expect(getByText(holdingLabel)).toBeInTheDocument();
  });

  it('should render holding options', async () => {
    const { findAllByText, getByText } = renderFieldHolding({});

    await userEvent.click(getByText('stripes-components.selection.controlLabel'));

    const renderedHoldingOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedHoldingOptions.length).toBe(locations.length);
  });

  it('should not render find location plugin button', () => {
    const { queryByText } = renderFieldHolding({ isDisabled: true });

    expect(queryByText('stripes-acq-components.holding.createFromLocation')).not.toBeInTheDocument();
  });

  it('should be required', () => {
    const { queryByText } = renderFieldHolding({ labelId: holdingLabel, required: true });

    expect(within(queryByText(holdingLabel)).getByText(/\*/i)).toBeInTheDocument();
  });

  it('should filter holdings list', () => {
    renderFieldHolding(
      { filterHoldings: (_holdings) => _holdings.slice(0, 1) },
      { initialValues: { [defaultProps.name]: holdings[0].id } },
    );

    const locationsMap = keyBy(locations, 'id');

    expect(screen.getAllByText(locationsMap[holdings[0].permanentLocationId].name)[0]).toBeInTheDocument();
    expect(screen.queryByText(locationsMap[holdings[1].permanentLocationId].name)).not.toBeInTheDocument();
  });

  it('should clear selected holding when tenant changes', () => {
    const onChange = jest.fn();
    const { rerender } = renderFieldHolding({ tenantId: 'tenant1', onChange });

    rerender(
      <Form
        onSubmit={jest.fn()}
        initialValues={{ holdingId: holdings[0].id }}
        render={() => (
          <FieldHolding
            {...defaultProps}
            tenantId="tenant2"
            onChange={onChange}
          />
        )}
      />,
    );

    expect(onChange).toHaveBeenCalledWith(null, defaultProps.locationFieldName);
  });
});
