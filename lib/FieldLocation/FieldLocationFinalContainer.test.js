import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import { Form } from 'react-final-form';

import '../../test/jest/__mock__';

import FieldLocationFinalContainer from './FieldLocationFinalContainer';

const renderFieldLocationFinalContainer = (mutator, locationIds, onChange = noop) => (render(
  <IntlProvider locale="en">
    <Form
      onSubmit={noop}
      render={() => (
        <FieldLocationFinalContainer
          mutator={mutator}
          onChange={onChange}
          locationIds={locationIds}
          name="locationId"
        />
      )}
    />
  </IntlProvider>,
));

describe('FieldLocationFinalContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      fieldLocations: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load locations when locationIds are passed', async () => {
    let findByText;
    const locationIds = ['001'];
    const locations = [{ name: 'location', id: '001' }];

    mutator.fieldLocations.GET.mockReturnValue(Promise.resolve(locations));

    await act(async () => {
      findByText = renderFieldLocationFinalContainer(mutator, locationIds).findByText;
    });

    expect(mutator.fieldLocations.GET).toHaveBeenCalled();
    expect(findByText(locations[0].name)).toBeDefined();
  });
});
