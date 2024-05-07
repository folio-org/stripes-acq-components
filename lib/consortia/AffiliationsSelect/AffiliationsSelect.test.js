import { render, within } from '@testing-library/react';

import { affiliations } from '../../../test/jest/fixtures';
import { AffiliationsSelect } from './AffiliationsSelect';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');

const defaultProps = {
  id: 'test',
  affiliations,
  value: affiliations[2].tenantId,
  onChange: jest.fn(),
  isLoading: false,
};

const renderAffiliationsSelect = (props = {}) => render(
  <AffiliationsSelect
    {...defaultProps}
    {...props}
  />,
);

describe('AffiliationsSelect', () => {
  it('should render affiliation select with provided options', () => {
    renderAffiliationsSelect();

    expect(
      within(document.getElementById('test-affiliations-select'))
        .getByText(affiliations[2].tenantName),
    ).toBeInTheDocument();
    affiliations.forEach(({ tenantName, isPrimary }) => {
      expect(
        within(document.getElementById('sl-test-affiliations-select'))
          .getByText(isPrimary ? `${tenantName} stripes-acq-components.consortia.affiliations.primary.label` : tenantName),
      ).toBeInTheDocument();
    });
  });
});
