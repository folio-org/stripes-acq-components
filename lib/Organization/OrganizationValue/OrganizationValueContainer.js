import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import { organizationByPropManifest } from '../../manifests';
import OrganizationValue from './OrganizationValue';

const OrganizationValueContainer = ({
  id,
  isLink = true,
  label = <FormattedMessage id="stripes-acq-components.organization" />,
  mutator,
}) => {
  const intl = useIntl();
  const [organization, setOrganization] = useState();

  useEffect(
    () => {
      setOrganization();

      if (id) {
        mutator.organizationValueOrg.GET()
          .then(setOrganization)
          .catch(() => setOrganization({
            id,
            name: intl.formatMessage({ id: 'stripes-acq-components.invalidReference' }),
          }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const { id: organizationId, name } = (organization || {});

  const displayValue = (isLink && organizationId)
    ? <Link to={`/organizations/view/${organizationId}`}>{name}</Link>
    : name;

  return (
    <OrganizationValue
      label={label}
      value={displayValue}
    />
  );
};

OrganizationValueContainer.manifest = Object.freeze({
  organizationValueOrg: organizationByPropManifest,
});

OrganizationValueContainer.propTypes = {
  id: PropTypes.string,
  isLink: PropTypes.bool,
  label: PropTypes.node,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(OrganizationValueContainer);
