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
  name: donor => (canViewOrganizations ? <TextLink to={getDonorUrl(donor.id)}>{donor.name}</TextLink> : donor.name),
  code: donor => donor.code,
});

export const getDonorsFormatter = ({
  canViewOrganizations,
  fields,
  intl,
  onRemove,
}) => ({
  ...getDonorsListFormatter({ canViewOrganizations }),
  unassignDonor: donor => (
    <Button
      aria-label={intl.formatMessage({ id: 'stripes-acq-components.donors.button.unassign' })}
      buttonStyle="fieldControl"
      type="button"
      onClick={(e) => {
        e.preventDefault();
        fields.remove(donor._index);
        onRemove(fields.value[donor._index]);
      }}
    >
      <Icon icon="times-circle" />
    </Button>
  ),
});
