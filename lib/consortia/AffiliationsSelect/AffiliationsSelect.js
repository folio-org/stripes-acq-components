import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Selection } from '@folio/stripes/components';

import { useAffiliationsSelectionOptions } from '../../hooks';

export const AffiliationsSelect = ({
  affiliations,
  id,
  isLoading,
  label: labelProp,
  onChange,
  value,
}) => {
  const { dataOptions } = useAffiliationsSelectionOptions(affiliations);

  const handleChange = useCallback((_value) => {
    onChange(_value);
  }, [onChange]);

  return (
    <Selection
      id={`${id}-affiliations-select`}
      label={labelProp}
      dataOptions={dataOptions}
      onChange={handleChange}
      value={value}
      disabled={isLoading}
    />
  );
};

AffiliationsSelect.defaultProps = {
  id: 'user-assigned',
  label: <FormattedMessage id="ui-users.affiliations.select.label" />,
};

AffiliationsSelect.propTypes = {
  affiliations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    isPrimary: PropTypes.bool,
    tenantId: PropTypes.string,
    tenantName: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
  })),
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};