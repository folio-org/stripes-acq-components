import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import OrganizationValue from './OrganizationValue';
import { organizationByPropManifest } from '../../manifests';

const OrganizationValueContainer = ({
  id,
  isLink,
  label,
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

OrganizationValueContainer.defaultProps = {
  isLink: true,
  label: <FormattedMessage id="stripes-acq-components.organization" />,
};

export default stripesConnect(OrganizationValueContainer);
