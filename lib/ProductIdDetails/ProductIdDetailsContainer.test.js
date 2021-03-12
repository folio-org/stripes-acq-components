import React from 'react';
import { render, screen } from '@testing-library/react';

import { DICT_IDENTIFIER_TYPES } from '../constants';
import ProductIdDetailsContainer from './ProductIdDetailsContainer';
import ProductIdDetails from './ProductIdDetails';

const PRODUCT_TYPES = [{ id: '1', name: 'type 1' }];

jest.mock('./ProductIdDetails', () => {
  return jest.fn(() => 'ProductIdDetails');
});

const renderComponent = (props = {}) => (render(
  <ProductIdDetailsContainer
    {...props}
  />,
));

describe('ProductIdDetailsContainer', () => {
  const resources = { [DICT_IDENTIFIER_TYPES]: { records: PRODUCT_TYPES } };

  beforeEach(() => {
    ProductIdDetails.mockClear();
  });

  it('should display ProductIdDetails', () => {
    renderComponent();
    expect(screen.getByText('ProductIdDetails')).toBeDefined();
  });

  it('should pass dictionary with contr name types to the child', () => {
    renderComponent({ resources });
    expect(ProductIdDetails.mock.calls[0][0].identifierTypes).toEqual(PRODUCT_TYPES);
  });
});
