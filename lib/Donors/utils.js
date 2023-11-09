import {
  Button,
  Icon,
  TextLink,
} from '@folio/stripes/components';

const getDonorUrl = (orgId) => {
  if (orgId) {
    return `/organizations/view/${orgId}`;
  }

  return undefined;
};

export const getDonorsListFormatter = ({ canViewOrganizations }) => ({
  name: donor => <TextLink to={getDonorUrl(canViewOrganizations && donor.id)}>{donor.name}</TextLink>,
  code: donor => donor.code,
});

export const getDonorsFormatter = ({ canViewOrganizations, fields, intl }) => ({
  ...getDonorsListFormatter({ canViewOrganizations }),
  unassignDonor: donor => (
    <Button
      align="end"
      aria-label={intl.formatMessage({ id: 'stripes-acq-components.donors.button.unassign' })}
      buttonStyle="fieldControl"
      type="button"
      onClick={(e) => {
        e.preventDefault();
        fields.remove(donor._index);
      }}
    >
      <Icon icon="times-circle" />
    </Button>
  ),
});
