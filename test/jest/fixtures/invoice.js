import { acqUnit } from './acqUnit';
import { address } from './address';
import { batchGroup } from './batchGroup';
import { vendor } from './vendor';

export const invoice = {
  accountingCode: 'G64758-74834',
  adjustments: [],
  batchGroupId: batchGroup.id,
  chkSubscriptionOverlap: true,
  currency: 'USD',
  exportToAccounting: true,
  id: '2e5067cd-2dc8-4d99-900d-b4518bb6407f',
  invoiceDate: '2021-06-08',
  paymentMethod: 'Credit Card',
  source: 'EDI',
  status: 'Open',
  vendorId: vendor.id,
  vendorInvoiceNo: 'edi',
  billTo: address.id,
  acqUnitIds: [acqUnit.id],
};
