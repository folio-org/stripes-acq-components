import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import { useUserAffiliations } from '../../hooks';
import { AffiliationsSelect } from '../AffiliationsSelect';
import { FieldSelectionFinal } from '../../FieldSelection';

export const FieldAffiliations = ({ name, ...rest }) => {
  const stripes = useStripes();

  const {
    affiliations,
    isFetching,
  } = useUserAffiliations(
    { userId: stripes?.user?.user?.id },
  );

  const dataOptions = useMemo(() => affiliations.map(({ tenantId, tenantName }) => ({
    label: tenantName,
    value: tenantId,
  })), [affiliations]);

  return (
    <FieldSelectionFinal
      dataOptions={dataOptions}
      name={name}
      isLoading={isFetching}
      {...rest}
    />
  );
};

FieldAffiliations.defaultProps = {
  labelId: 'ui-users.affiliations.select.label',
};

FieldAffiliations.propTypes = {
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
};
