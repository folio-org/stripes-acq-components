import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { mockOffsetSize } from 'helpers/mockOffsetSize';
import { REF_NUMBER_TYPE } from '../../constants';
import VendorReferenceNumbersDetails from './VendorReferenceNumbersDetails';

const referenceNumbers = [{ refNumber: 'TEST', refNumberType: REF_NUMBER_TYPE.titleNumber }];

const renderComponent = (props = {}) => render(
  <VendorReferenceNumbersDetails {...props} />,
);

describe('VendorReferenceNumbersDetails', () => {
  mockOffsetSize(500, 500);

  it('should display VendorReferenceNumbersDetails', async () => {
    renderComponent({ referenceNumbers });

    expect(screen.getByText('stripes-acq-components.referenceNumbers.refNumberType.titleNumber')).toBeInTheDocument();
  });
});
