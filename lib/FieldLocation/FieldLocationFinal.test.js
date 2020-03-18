import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import '../../test/jest/__mock__';

import FieldLocationFinal from './FieldLocationFinal';

const renderFieldLocationFinal = (locationId, labelId, mutator, onChange = noop) => (render(
  <IntlProvider locale="en">
    <Form
      onSubmit={noop}
      render={() => (
        <FieldLocationFinal
          locationId={locationId}
          labelId={labelId}
          mutator={mutator}
          onChange={onChange}
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

  it('should not load location when locationId is no defined', () => {
    renderFieldLocationFinal(undefined, undefined, mutator);

    expect(mutator.fieldLocation.GET).not.toHaveBeenCalled();
  });

  it('should load location when locationId is passed', async () => {
    let findByText;
    const location = { name: 'Main', id: '001' };

    mutator.fieldLocation.GET.mockReturnValue(Promise.resolve(location));

    await act(async () => {
      findByText = renderFieldLocationFinal(location.id, undefined, mutator).findByText;
    });

    expect(mutator.fieldLocation.GET).toHaveBeenCalled();
    expect(findByText(location.name)).toBeDefined();
  });

  it('should display passed label', () => {
    const locationLabel = 'Location';
    const { getByText } = renderFieldLocationFinal(undefined, locationLabel, mutator);

    expect(getByText(locationLabel)).toBeDefined();
  });
});
