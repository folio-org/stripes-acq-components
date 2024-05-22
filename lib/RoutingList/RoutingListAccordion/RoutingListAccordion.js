import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useReactToPrint } from 'react-to-print';

import {
  Accordion,
  Badge,
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  Loading,
  MenuSection,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { useShowCallout } from '../../hooks';
import { useRoutingLists } from '../hooks';
import {
  columnMapping,
  columnWidths,
  ROUTING_LIST_ACCORDION_ID,
  getRoutingListFormatter,
  visibleColumns,
  DEFAULT_ROUTING_LIST_URL,
} from './constants';
import { RoutingListAccordionTable } from './RoutingListAccordionTable';
import { getRoutingListTemplateContent } from './utils';

export const RoutingListAccordion = ({
  actionMenu,
  canPrint,
  disabled,
  poLineId,
  columnWidths: columnWidthsProp,
  allowedNumberOfRoutingLists,
  createButtonLabel,
  routingListUrl,
}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const showCallout = useShowCallout();
  const templateRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => templateRef.current,
    pageStyle: `
      @media print {
        html, body {
          height: initial !important;
          overflow: initial !important;
          -webkit-print-color-adjust: exact;
        }
      }
      
      @media print {
        .page-break {
          margin-top: 1rem;
          display: block;
          clear: both;
          page-break-after: always;
        }
      }
    `,
  });

  const { isLoading, routingLists } = useRoutingLists(poLineId);

  const createRoutingListUrl = `${routingListUrl}/create/${poLineId}`;
  const isCreateButtonDisabled = disabled || allowedNumberOfRoutingLists === routingLists.length;

  const onPrintRoutingList = useCallback(async () => {
    try {
      const templateContent = await getRoutingListTemplateContent(ky, routingLists);

      templateRef.current = templateContent;
      handlePrint();
    } catch (error) {
      showCallout({
        type: 'error',
        messageId: 'stripes-acq-components.routing.list.actions.printRoutingList.error',
      });
    }
  }, [ky, routingLists, handlePrint, showCallout]);

  const defaultActionMenu = useMemo(() => (
    <Dropdown
      label={<FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />}
      buttonProps={{ buttonStyle: 'primary' }}
      modifiers={{
        preventOverflow: { boundariesElement: 'scrollParent' },
      }}
    >
      <DropdownMenu>
        <MenuSection
          label={intl.formatMessage({ id: 'stripes-components.paneMenuActionsToggleLabel' })}
          id="routing-list-menu-actions"
        >
          <Button
            data-test-routing-list-button
            to={createRoutingListUrl}
            buttonStyle="dropdownItem"
            disabled={isCreateButtonDisabled}
          >
            <Icon size="small" icon="plus-sign">
              {createButtonLabel}
            </Icon>
          </Button>
          {
            canPrint && (
              <Button
                data-test-routing-list-print-button
                buttonStyle="dropdownItem"
                onClick={onPrintRoutingList}
              >
                <Icon size="small" icon="print">
                  <FormattedMessage id="stripes-acq-components.routing.list.actions.printRoutingList" />
                </Icon>
              </Button>
            )
          }
        </MenuSection>
      </DropdownMenu>
    </Dropdown>
  ), [canPrint, createButtonLabel, createRoutingListUrl, intl, isCreateButtonDisabled, onPrintRoutingList]);

  const routingListFormatter = useMemo(() => getRoutingListFormatter(routingListUrl), [routingListUrl]);

  const createButton = (
    <Button
      marginBottom0
      to={createRoutingListUrl}
      disabled={isCreateButtonDisabled}
    >
      {createButtonLabel}
    </Button>
  );

  const actionMenuComponent = routingLists.length
    ? actionMenu || defaultActionMenu
    : createButton;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Accordion
      displayWhenClosed={(
        <Badge>
          <span data-test-routing-list-accordion-quantity-indicator>
            {routingLists.length}
          </span>
        </Badge>
      )}
      displayWhenOpen={actionMenuComponent}
      closedByDefault={!routingLists.length}
      id={ROUTING_LIST_ACCORDION_ID}
      label={intl.formatMessage({ id: 'stripes-acq-components.routing.list.label' })}
    >
      <RoutingListAccordionTable
        columnMapping={columnMapping}
        contentData={routingLists}
        formatter={routingListFormatter}
        visibleColumns={visibleColumns}
        columnWidths={columnWidthsProp}
      />
    </Accordion>
  );
};

RoutingListAccordion.propTypes = {
  actionMenu: PropTypes.node,
  allowedNumberOfRoutingLists: PropTypes.number,
  columnWidths: PropTypes.object,
  disabled: PropTypes.bool,
  poLineId: PropTypes.string.isRequired,
  createButtonLabel: PropTypes.string,
  routingListUrl: PropTypes.string,
  canPrint: PropTypes.bool,
};

RoutingListAccordion.defaultProps = {
  actionMenu: null,
  allowedNumberOfRoutingLists: 0,
  columnWidths,
  createButtonLabel: <FormattedMessage id="stripes-components.button.new" />,
  disabled: false,
  canPrint: false,
  routingListUrl: DEFAULT_ROUTING_LIST_URL,
};
