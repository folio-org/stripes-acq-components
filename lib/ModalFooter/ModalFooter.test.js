/* istanbul ignore */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '../../test/jest/__mock__';

import ModalFooter from './ModalFooter';

const renderModalFooter = () => (render(
  <IntlProvider locale="en">
    <ModalFooter
      renderStart={(
        <div data-testid="cancelBtn" />
      )}
      renderEnd={(
        <div data-testid="submitBtn" />
      )}
    />
  </IntlProvider>,
));

describe('Given ModalFooter component', () => {
  afterEach(cleanup);

  it('Than it should display passed buttons', () => {
    const { getByTestId } = renderModalFooter();

    expect(getByTestId('cancelBtn')).toBeDefined();
    expect(getByTestId('submitBtn')).toBeDefined();
  });
});
