import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useLocation } from 'react-router-dom';
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
  DEFAULT_ROUTING_LIST_URL,
  getRoutingListFormatter,
  ROUTING_LIST_ACCORDION_ID,
  visibleColumns,
} from './constants';
import { RoutingListAccordionTable } from './RoutingListAccordionTable';
import { getRoutingListTemplateContent } from './utils';

import css from './RoutingListAccordion.css';

export const RoutingListAccordion = ({
  actionMenu = null,
  allowedNumberOfRoutingLists = 0,
  canPrint = false,
  columnWidths: columnWidthsProp = columnWidths,
  createButtonLabel = <FormattedMessage id="stripes-components.button.new" />,
  disabled = false,
  poLineId,
  routingListUrl = DEFAULT_ROUTING_LIST_URL,
  tenantId,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const ky = useOkapiKy({ tenant: tenantId });
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

  const { isFetching, routingLists } = useRoutingLists(poLineId, { tenantId });

  const returnUrl = btoa(location.pathname + location.search);
  const createRoutingListUrl = `${routingListUrl}/create/${poLineId}?returnUrl=${returnUrl}`;
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
            buttonClass={css.addRoutingListButton}
          >
            <Icon size="small" icon="plus-sign">
              {createButtonLabel}
            </Icon>
          </Button>
          {
            canPrint && (
              <Button
                data-testid="routing-list-print-button"
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

  const routingListFormatter = useMemo(() => {
    return getRoutingListFormatter(routingListUrl, returnUrl);
  }, [routingListUrl, returnUrl]);

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

  if (isFetching) {
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
  canPrint: PropTypes.bool,
  columnWidths: PropTypes.object,
  createButtonLabel: PropTypes.string,
  disabled: PropTypes.bool,
  poLineId: PropTypes.string.isRequired,
  routingListUrl: PropTypes.string,
  tenantId: PropTypes.string,
};
