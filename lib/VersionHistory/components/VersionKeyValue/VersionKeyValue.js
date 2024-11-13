import PropTypes from 'prop-types';
import {
  useContext,
  useMemo,
} from 'react';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { VersionViewContext } from '../../VersionViewContext';

export const VersionKeyValue = ({
  children,
  label,
  multiple,
  name,
  value,
}) => {
  const versionContext = useContext(VersionViewContext);
  const isUpdated = useMemo(() => (
    multiple
      ? versionContext?.paths?.find((field) => new RegExp(`^${name}\\[\\d\\]$`).test(field))
      : versionContext?.paths?.includes(name)
  ), [multiple, name, versionContext?.paths]);

  const content = (children || value) || <NoValue />;
  const displayValue = isUpdated ? <mark>{content}</mark> : content;

  return (
    <KeyValue
      label={label}
      value={displayValue}
    />
  );
};

VersionKeyValue.defaultProps = {
  multiple: false,
};

VersionKeyValue.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node.isRequired,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.node,
};
