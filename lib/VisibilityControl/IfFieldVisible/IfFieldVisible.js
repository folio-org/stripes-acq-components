import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';

import { IfVisible } from '../IfVisible';

export const IfFieldVisible = ({
  children,
  name,
  visible = true,
}) => {
  const { errors } = useFormState();
  const hasError = Boolean(get(errors, name));
  const isVisible = visible || hasError;

  return <IfVisible visible={isVisible}>{children}</IfVisible>;
};

IfFieldVisible.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  visible: PropTypes.bool,
};
