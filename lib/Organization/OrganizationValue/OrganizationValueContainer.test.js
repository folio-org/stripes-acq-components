import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import OrganizationValue from './OrganizationValueContainer';

const defaultProps = {
  isLink: false,
};

const renderOrganizationValue = (props = {}) => render(
  <OrganizationValue
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrganizationValueContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      organizationValueOrg: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not load organization when id is no defined', () => {
    renderOrganizationValue({ mutator });

    expect(mutator.organizationValueOrg.GET).not.toHaveBeenCalled();
  });

  it('should load organziation when id is passed', async () => {
    let getByText;
    const organization = { name: 'EBSCO', id: '15' };

    mutator.organizationValueOrg.GET.mockReturnValue(Promise.resolve(organization));

    await act(async () => {
      getByText = renderOrganizationValue({ id: organization.id, mutator }).getByText;
    });

    expect(mutator.organizationValueOrg.GET).toHaveBeenCalled();
    expect(getByText(organization.name)).toBeInTheDocument();
  });

  it('should display invalid reference if organization is not valid', async () => {
    let getByText;

    mutator.organizationValueOrg.GET.mockReturnValue(Promise.reject());

    await act(async () => {
      getByText = renderOrganizationValue({ id: 'invalidOrgId', mutator }).getByText;
    });

    expect(mutator.organizationValueOrg.GET).toHaveBeenCalled();
    expect(getByText('stripes-acq-components.invalidReference')).toBeInTheDocument();
  });

  it('should display default label when it is not passed', () => {
    const { getByText } = renderOrganizationValue({ mutator });

    expect(getByText('stripes-acq-components.organization')).toBeInTheDocument();
  });

  it('should display passed label', () => {
    const orgValueLabel = 'Organization';
    const { getByText } = renderOrganizationValue({ mutator, label: orgValueLabel });

    expect(getByText(orgValueLabel)).toBeInTheDocument();
  });

  it('should display organization value as a Link to orgs app', async () => {
    const id = 'testOrg';
    const organization = { name: 'Test org', id };

    mutator.organizationValueOrg.GET.mockResolvedValue(organization);

    renderOrganizationValue({
      mutator,
      id,
      label: 'Organization',
      isLink: true,
    });

    const link = await screen.findByText(organization.name);

    expect(link.tagName.toLocaleLowerCase()).toEqual('a');
    expect(link).toHaveAttribute('href', `/organizations/view/${id}`);
  });
});
