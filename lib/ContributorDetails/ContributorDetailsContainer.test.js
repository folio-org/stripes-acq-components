import React from 'react';
import { render, screen } from '@testing-library/react';

import ContributorDetailsContainer from './ContributorDetailsContainer';
import ContributorDetails from './ContributorDetails';

const CONTRIBUTOR_NAME_TYPES = [{ id: '1', name: 'contr 1' }];

jest.mock('./ContributorDetails', () => {
  return jest.fn(() => 'ContributorDetails');
});

const renderComponent = (props = {}) => (render(
  <ContributorDetailsContainer
    {...props}
  />,
));

describe('ContributorDetailsContainer', () => {
  const resources = { contributorNameTypes: { records: CONTRIBUTOR_NAME_TYPES } };

  beforeEach(() => {
    ContributorDetails.mockClear();
  });

  it('should display ContributorDetails', () => {
    renderComponent();
    expect(screen.getByText('ContributorDetails')).toBeDefined();
  });

  it('should pass dictionary with contr name types to the child', () => {
    renderComponent({ resources });
    expect(ContributorDetails.mock.calls[0][0].contributorNameTypes).toEqual(CONTRIBUTOR_NAME_TYPES);
  });
});
