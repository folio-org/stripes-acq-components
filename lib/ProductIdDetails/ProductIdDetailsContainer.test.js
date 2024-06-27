import {
  render,
  screen,
} from '@testing-library/react';

import { useIdentifierTypes } from '../hooks';
import ProductIdDetailsContainer from './ProductIdDetailsContainer';
import ProductIdDetails from './ProductIdDetails';

const PRODUCT_TYPES = [{ id: '1', name: 'type 1' }];

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useIdentifierTypes: jest.fn(),
}));
jest.mock('./ProductIdDetails', () => {
  return jest.fn(() => 'ProductIdDetails');
});

const renderComponent = (props = {}) => (render(
  <ProductIdDetailsContainer
    {...props}
  />,
));

describe('ProductIdDetailsContainer', () => {
  beforeEach(() => {
    ProductIdDetails.mockClear();
    useIdentifierTypes
      .mockClear()
      .mockReturnValue({ identifierTypes: PRODUCT_TYPES });
  });

  it('should display ProductIdDetails', () => {
    renderComponent();
    expect(screen.getByText('ProductIdDetails')).toBeDefined();
  });

  it('should pass dictionary with contr name types to the child', () => {
    renderComponent();
    expect(ProductIdDetails.mock.calls[0][0].identifierTypes).toEqual(PRODUCT_TYPES);
  });
});
