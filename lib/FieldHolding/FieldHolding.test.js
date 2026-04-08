import keyBy from 'lodash/keyBy';
import { MemoryRouter } from 'react-router-dom';

import {
  act,
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

    await act(async () => {
      await userEvent.click(getByText('stripes-components.selection.controlLabel'));
    });

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

  describe('Holding options with instance tracking', () => {
    it('should include initial holding in options when invalid AND viewing initial instance', async () => {
      const invalidHoldingId = '99';
      const initialInstanceId = 'instance1';

      useInstanceHoldings.mockReturnValue({ holdings });

      renderFieldHolding(
        { instanceId: initialInstanceId },
        {
          initialValues: {
            holdingId: invalidHoldingId,
            instanceId: initialInstanceId,
          },
        },
      );

      await act(async () => {
        await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
      });

      expect(screen.getAllByRole('option')).toHaveLength(holdings.length + 2); // +1 for empty option and +1 for invalid initial holding
      expect(screen.getByRole('option', { name: /invalidReference/ })).toBeInTheDocument();
    });

    it('should NOT include initial holding when viewing different instance', async () => {
      const invalidHoldingId = '99';
      const initialInstanceId = 'instance1';
      const currentInstanceId = 'instance2';

      useInstanceHoldings.mockReturnValue({ holdings });

      renderFieldHolding(
        { instanceId: currentInstanceId },
        {
          initialValues: {
            holdingId: invalidHoldingId,
            instanceId: initialInstanceId,
          },
        },
      );

      await act(async () => {
        await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
      });

      // Should only have options for valid holdings, not the invalid initial holding
      expect(screen.getAllByRole('option')).toHaveLength(holdings.length + 1); // +1 for empty option
      // Verify the initial holding is not available
      expect(screen.queryByRole('option', { name: /invalidReference/ })).not.toBeInTheDocument();
    });

    it('should NOT include initial holding (duplicate option) when holding is valid', async () => {
      const validInitialHoldingId = holdings[0].id;
      const initialInstanceId = 'instance1';

      useInstanceHoldings.mockReturnValue({ holdings });

      renderFieldHolding(
        { instanceId: initialInstanceId },
        {
          initialValues: {
            holdingId: validInitialHoldingId,
            instanceId: initialInstanceId,
          },
        },
      );

      await act(async () => {
        await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
      });

      expect(screen.getAllByRole('option')).toHaveLength(holdings.length + 1); // +1 for empty option
      expect(screen.queryByRole('option', { name: /invalidReference/ })).not.toBeInTheDocument();
    });

    it('should handle missing initialInstanceId gracefully', async () => {
      const invalidHoldingId = '99';
      const moreHoldings = [...holdings];

      useInstanceHoldings.mockReturnValue({ holdings: moreHoldings });

      renderFieldHolding(
        { instanceId: 'instance1' },
        {
          initialValues: {
            holdingId: invalidHoldingId,
            // No instanceId in initial values
          },
        },
      );

      await act(async () => {
        await userEvent.click(screen.getByText('stripes-components.selection.controlLabel'));
      });

      // Should only render valid holdings since initialInstanceId is undefined
      expect(screen.getAllByRole('option')).toHaveLength(holdings.length + 1); // +1 for empty option
    });
  });
});
