import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { mockOffsetSize } from 'helpers/mockOffsetSize';
import ProductIdDetails from './ProductIdDetails';

const identifierTypes = [{ id: 'type1', name: 'type 1' }];
const productIds = [{ productId: 'product1', productIdType: 'type1' }];

const renderComponent = (props) => render(
  <ProductIdDetails {...props} />,
);

describe('ProductIdDetails', () => {
  mockOffsetSize(500, 500);

  it('should display name for product type', () => {
    renderComponent({ identifierTypes, productIds });
    expect(screen.getByText('type 1')).toBeInTheDocument();
  });
});
