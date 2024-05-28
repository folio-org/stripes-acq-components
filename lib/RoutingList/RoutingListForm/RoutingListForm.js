import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  HasCommand,
  Pane,
  PaneFooter,
  PaneHeader,
  Paneset,
  Row,
  TextArea,
  TextField,
  checkScope,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  handleKeyCommand,
  validateRequired,
} from '../../utils';
import { RoutingListUsers } from '../RoutingListUsers';
import { getAppName } from '../utils';

const RoutingListForm = (props) => {
  const accordionStatusRef = useRef();
  const {
    handleSubmit,
    initialValues: {
      metadata,
    },
    intl: {
      formatMessage,
    },
    form: {
      change,
    },
    onCancel,
    paneTitle,
    pristine,
    submitting,
    values,
  } = props;
  const appName = getAppName();

  const onAddUsers = (selectedUserIds = []) => {
    change('userIds', selectedUserIds);
  };

  const renderHeader = (paneHeaderProps) => {
    return (
      <PaneHeader
        {...paneHeaderProps}
        dismissible
        onClose={onCancel}
        paneTitle={paneTitle}
      />
    );
  };

  const renderFooter = () => {
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        marginBottom0
        disabled={(pristine || submitting)}
        id="routing-list-save-button"
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-acq-components.routing.list.create.paneMenu.save" />
      </Button>
    );

    const cancelButton = (
      <Button
        marginBottom0
        buttonStyle="default mega"
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    return (
      <PaneFooter
        renderEnd={saveButton}
        renderStart={cancelButton}
      />
    );
  };

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset isRoot>
        <Pane
          id="routing-list-pane"
          appIcon={<AppIcon app={appName} appIconKey={appName} />}
          defaultWidth="fill"
          renderHeader={renderHeader}
          footer={renderFooter()}
        >
          <form id="routing-list-form">
            <AccordionStatus>
              <Row end="xs">
                <Col data-test-expand-all>
                  <ExpandAllButton />
                </Col>
              </Row>
              <AccordionSet>
                <Accordion label={formatMessage({ id: 'stripes-acq-components.routing.list.generalInformation' })}>
                  <AccordionSet>
                    {metadata && <ViewMetaData metadata={metadata} />}
                  </AccordionSet>
                  <Row>
                    <Col xs={12}>
                      <Field
                        label={formatMessage({ id: 'stripes-acq-components.routing.list.name' })}
                        name="name"
                        id="input-routing-list-name"
                        component={TextField}
                        required
                        validate={validateRequired}
                      />
                    </Col>
                    <Col xs={12}>
                      <Field
                        label={formatMessage({ id: 'stripes-acq-components.routing.list.notes' })}
                        name="notes"
                        id="input-routing-list-notes"
                        component={TextArea}
                      />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion label={formatMessage({ id: 'stripes-acq-components.routing.list.users' })}>
                  <Field
                    component={RoutingListUsers}
                    name="userIds"
                    onAddUsers={onAddUsers}
                    ids={values.userIds}
                    editable
                  />
                </Accordion>
              </AccordionSet>
            </AccordionStatus>
          </form>
        </Pane>
      </Paneset>
    </HasCommand>
  );
};

RoutingListForm.propTypes = {
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  form: PropTypes.object.isRequired,
  paneTitle: PropTypes.node.isRequired,
  pristine: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  values: PropTypes.object,
};

RoutingListForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(injectIntl(RoutingListForm));
