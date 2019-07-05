// eslint-disable-next-line import/prefer-default-export
export const getOrganizationsOptions = (orgs = []) => orgs.map(org => ({
  value: org.id,
  label: `${org.name} (${org.code})`,
}));
