import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectionFinal } from '../FieldSelection';

const DEFAULT_LABEL = <FormattedMessage id="stripes-acq-components.consortia.affiliations.select.label" />;

export const FieldAffiliation = ({
  label,
  labelless = false,
  ...rest
}) => {
  return (
    <FieldSelectionFinal
      label={labelless ? undefined : (label ?? DEFAULT_LABEL)}
      {...rest}
    />
  );
};

FieldAffiliation.propTypes = {
  label: PropTypes.node,
  labelless: PropTypes.bool,
};
