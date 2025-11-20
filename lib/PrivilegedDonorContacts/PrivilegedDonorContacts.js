import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { defaultColumnMapping } from './constants';
import { ContactsContainer } from './ContactsContainer';
import { useFetchPrivilegedContacts } from './hooks';

const DEFAULT_PRIVILEGED_CONTACT_IDS = [];

export function PrivilegedDonorContacts({
  columnMapping = defaultColumnMapping,
  name = 'privilegedContacts',
  onChange = noop,
  privilegedContactIds = DEFAULT_PRIVILEGED_CONTACT_IDS,
  ...rest
}) {
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
          columnMapping={columnMapping}
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
  name: PropTypes.string,
  onChange: PropTypes.func,
  privilegedContactIds: PropTypes.arrayOf(PropTypes.string),
  searchLabel: PropTypes.node,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};
