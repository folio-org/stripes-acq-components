import get from 'lodash/get';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import {
  useForm,
  useFormState,
} from 'react-final-form';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { FieldInventory } from '../../../FieldInventory';
import {
  useAffiliationsSelectionOptions,
  useCurrentUserTenants,
} from '../../../hooks/consortia';
import { FieldAffiliation } from '../FieldAffiliation';

export const ConsortiumFieldInventory = ({
  affiliationLabel,
  affiliationName = 'tenantId',
  disabled = false,
  labelless = false,
  onAffiliationChange = noop,
  required = false,
  ...rest
}) => {
  const { change } = useForm();
  const { values } = useFormState();
  const currUserTenants = useCurrentUserTenants();

  const affiliations = useMemo(() => {
    return currUserTenants?.map(({ id, name, isPrimary }) => ({
      tenantId: id,
      tenantName: name,
      isPrimary,
    }));
  }, [currUserTenants]);

  const { dataOptions } = useAffiliationsSelectionOptions(affiliations);

  const tenantId = get(values, affiliationName);

  const changeSelectedAffiliation = useCallback((selectedTenantId) => {
    change(affiliationName, selectedTenantId);
    onAffiliationChange(selectedTenantId);
  }, [affiliationName, change, onAffiliationChange]);

  return (
    <Row>
      <Col xs>
        <FieldAffiliation
          affiliationLabel={affiliationLabel}
          dataOptions={dataOptions}
          labelless={labelless}
          name={affiliationName}
          onChange={changeSelectedAffiliation}
          required={required}
        />
      </Col>
      <Col xs>
        <FieldInventory
          labelless={labelless}
          required={required}
          tenantId={tenantId}
          disabled={disabled || !tenantId}
          {...rest}
        />
      </Col>
    </Row>
  );
};

ConsortiumFieldInventory.propTypes = {
  affiliationLabel: PropTypes.node,
  affiliationName: PropTypes.string,
  disabled: PropTypes.bool,
  onAffiliationChange: PropTypes.func,
  labelless: PropTypes.bool,
  required: PropTypes.bool,
};
