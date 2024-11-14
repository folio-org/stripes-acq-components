import PropTypes from 'prop-types';
import { useContext, useMemo } from 'react';

import { Checkbox } from '@folio/stripes/components';

import { VersionViewContext } from '../../VersionViewContext';

export const VersionCheckbox = ({
  checked,
  label,
  name,
  ...props
}) => {
  const versionContext = useContext(VersionViewContext);
  const isUpdated = useMemo(() => (
    versionContext?.paths?.includes(name)
  ), [name, versionContext?.paths]);

  const checkboxLabel = isUpdated ? <mark>{label}</mark> : label;

  return (
    <Checkbox
      checked={Boolean(checked)}
      disabled
      label={checkboxLabel}
      vertical
      {...props}
    />
  );
};

VersionCheckbox.defaultProps = {
  checked: false,
};

VersionCheckbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};
