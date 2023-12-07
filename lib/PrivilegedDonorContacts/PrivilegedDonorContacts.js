import { noop } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { defaultColumnMapping } from './constants';
import { useFetchPrivilegedContacts } from './hooks';
import { ContactsContainer } from './ContactsContainer';

export function PrivilegedDonorContacts({ name, privilegedContactIds, onChange, ...rest }) {
  const [contactIds, setContactIds] = useState(privilegedContactIds);
  const { contacts, isLoading } = useFetchPrivilegedContacts(contactIds, { keepPreviousData: true });

  useEffect(() => {
    setContactIds(privilegedContactIds);
  }, [privilegedContactIds]);

  const onSetContactIds = (values = []) => {
    setContactIds(values);
    onChange(values);
  };

  return (
    <Row>
      <Col xs={12}>
        <FieldArray
          name={name}
          id={name}
          component={ContactsContainer}
          setContactIds={onSetContactIds}
          contacts={contacts}
          loading={isLoading}
          {...rest}
        />
      </Col>
    </Row>
  );
}

PrivilegedDonorContacts.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  privilegedContactIds: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  onChange: PropTypes.func,
  searchLabel: PropTypes.node,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

PrivilegedDonorContacts.defaultProps = {
  columnMapping: defaultColumnMapping,
  privilegedContactIds: [],
  name: 'privilegedContacts',
  onChange: noop,
};
