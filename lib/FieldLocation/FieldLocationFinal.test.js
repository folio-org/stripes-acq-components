import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import '../../test/jest/__mock__';

import FieldLocationFinal from './FieldLocationFinal';

const locationsForSelect = [
  { value: '001', label: 'Location #1' },
  { value: '002', label: 'Location #2' },
  { value: '003', label: 'Location #3' },
];

const renderFieldLocationFinal = (locationId, labelId, mutator, locationOptions, onChange = noop) => (render(
  <IntlProvider locale="en">
    <Form
      onSubmit={noop}
      render={() => (
        <FieldLocationFinal
          locationId={locationId}
          labelId={labelId}
          mutator={mutator}
          name="anyFieldName"
          onChange={onChange}
          locationOptions={locationOptions}
          name="locationId"
        />
      )}
    />
  </IntlProvider>,
));

describe('FieldLocationFinal component', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      fieldLocation: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should render all passed options', async () => {
    const { findAllByText } = renderFieldLocationFinal(undefined, undefined, mutator, locationsForSelect);

    const renderedLocationOptions = await findAllByText(/Location #[0-9]/);

    expect(renderedLocationOptions.length).toBe(locationsForSelect.length);
  });

  it('should not load location when locationId is no defined', () => {
    renderFieldLocationFinal(undefined, undefined, mutator);

    expect(mutator.fieldLocation.GET).not.toHaveBeenCalled();
  });

  it('should load location when locationId is passed from location lookup', async () => {
    let findByText;
    const location = { name: 'Main', id: '001' };

    mutator.fieldLocation.GET.mockReturnValue(Promise.resolve(location));

    await act(async () => {
      findByText = renderFieldLocationFinal(location.id, undefined, mutator).findByText;
    });

    expect(mutator.fieldLocation.GET).toHaveBeenCalled();
    expect(findByText(location.name)).toBeDefined();
  });
});
