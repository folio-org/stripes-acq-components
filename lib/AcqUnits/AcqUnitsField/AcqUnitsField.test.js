import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import AcqUnitsField, { filter } from './AcqUnitsField';

const UNITS = [{ id: '1', name: 'unit 1' }, { id: '2', name: 'unit 2' }];

// eslint-disable-next-line react/prop-types
const renderForm = () => (
  <form>
    <AcqUnitsField
      id="acq-units"
      isFinal
      name="acq-units"
      units={UNITS}
    />
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} initialValues={{ 'acq-units': [] }} {...props} />
  </MemoryRouter>,
));

describe('AcqUnitsField', () => {
  it('should assign acq unit', async () => {
    renderComponent();
    expect(screen.getByText('0 items selected')).toBeDefined();

    await userEvent.click(screen.getByText('unit 2'));

    expect(screen.getByText('1 item selected')).toBeDefined();
  });

  it('should display preselected units and handle unassign click', async () => {
    const units = ['1', '2'];

    renderComponent({ initialValues: { 'acq-units': units } });

    expect(screen.getByText('2 items selected')).toBeDefined();

    await userEvent.click(screen.getAllByLabelText('times')[0]);

    expect(screen.getByText('1 item selected')).toBeDefined();
  });

  describe('filter', () => {
    const dataOptions = UNITS.map(unit => unit.id);

    it('should return data options for render when search is not defined', () => {
      expect(filter(UNITS, undefined, dataOptions)).toEqual({ renderedItems: dataOptions });
    });

    it('should return matched unites for render when search is defined', () => {
      expect(filter(UNITS, UNITS[0].name, dataOptions)).toEqual({ renderedItems: [UNITS[0].id] });
    });
  });
});
