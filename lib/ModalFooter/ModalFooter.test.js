/* istanbul ignore */
import React from 'react';
import { render, cleanup } from '@testing-library/react';

import '../../test/jest/__mock__';

import ModalFooter from './ModalFooter';

const renderModalFooter = () => (render(
  <ModalFooter
    renderStart={(
      <div data-testid="cancelBtn" />
    )}
    renderEnd={(
      <div data-testid="submitBtn" />
    )}
  />,
));

describe('Given ModalFooter component', () => {
  afterEach(cleanup);

  it('Than it should display passed buttons', () => {
    const { getByTestId } = renderModalFooter();

    expect(getByTestId('cancelBtn')).toBeDefined();
    expect(getByTestId('submitBtn')).toBeDefined();
  });
});
