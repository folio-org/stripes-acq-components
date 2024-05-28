import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Selection } from '@folio/stripes/components';

import { useAffiliationsSelectionOptions } from '../hooks';

export const AffiliationsSelection = ({
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

AffiliationsSelection.defaultProps = {
  label: <FormattedMessage id="stripes-acq-components.consortia.affiliations.select.label" />,
};

AffiliationsSelection.propTypes = {
  affiliations: PropTypes.arrayOf(PropTypes.shape({
    isPrimary: PropTypes.bool,
    tenantId: PropTypes.string,
    tenantName: PropTypes.string,
  })),
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
