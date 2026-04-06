import keyBy from 'lodash/keyBy';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  renderHook,
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { EVENT_EMITTER_EVENTS } from '../constants';
import {
  useEventEmitter,
  useInstanceHoldings,
} from '../hooks';
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

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const renderFieldHolding = (props = {}, formProps = {}) => render(
  <Form
    onSubmit={jest.fn()}
    {...formProps}
  >
    <FieldHolding
      {...defaultProps}
      {...props}
    />
  </Form>,
  { wrapper: MemoryRouter },
);

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
    const initialTenantId = 'tenant1';
    const changedTenantId = 'tenant2';

    renderFieldHolding({ tenantId: initialTenantId });

    const { result } = renderHook(() => useEventEmitter());

    result.current.emit(EVENT_EMITTER_EVENTS.FIELD_INVENTORY_AFFILIATION_CHANGED, {
      locationName: defaultProps.locationFieldName,
      holdingName: defaultProps.name,
      tenantId: changedTenantId,
    });

    expect(defaultProps.onChange).toHaveBeenCalledWith(null, defaultProps.locationFieldName);
  });

  it('should ignore tenant change of other fields', () => {
    const initialTenantId = 'tenant1';
    const changedTenantId = 'tenant2';

    renderFieldHolding({ tenantId: initialTenantId });

    const { result } = renderHook(() => useEventEmitter());

    result.current.emit(EVENT_EMITTER_EVENTS.FIELD_INVENTORY_AFFILIATION_CHANGED, {
      locationName: null,
      holdingName: 'otherField',
      tenantId: changedTenantId,
    });

    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
});
