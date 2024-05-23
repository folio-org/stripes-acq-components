import {
  render,
  within,
} from '@testing-library/react';

import { affiliations } from '../../test/jest/fixtures';
import { AffiliationsSelection } from './AffiliationsSelection';

jest.unmock('@folio/stripes/components');
jest.unmock('@folio/stripes/smart-components');

const defaultProps = {
  id: 'test',
  affiliations,
  value: affiliations[2].tenantId,
  onChange: jest.fn(),
  isLoading: false,
};

const renderAffiliationsSelection = (props = {}) => render(
  <AffiliationsSelection
    {...defaultProps}
    {...props}
  />,
);

describe('AffiliationsSelection', () => {
  it('should render affiliation selection with provided options', () => {
    renderAffiliationsSelection();

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
