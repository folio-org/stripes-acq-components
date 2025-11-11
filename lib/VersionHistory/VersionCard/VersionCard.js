import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import {
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Card,
  IconButton,
  List,
  Tooltip,
} from '@folio/stripes/components';

import css from './VersionCard.css';

const itemFormatter = (item, i) => (<li key={i} className={css.changedRecord}>{item}</li>);

const COLLAPSED_ITEMS_COUNT = 12;

const VersionCard = ({
  changedFields = [],
  id,
  isCurrent,
  isLatest,
  isOriginal,
  onSelect,
  source,
  title,
}) => {
  const intl = useIntl();
  const [isExpanded, setIsExpanded] = useState(false);

  const tooltip = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.card.select.tooltip' });

  const uniqueChangedFields = useMemo(() => uniq(changedFields), [changedFields]);
  const listItems = useMemo(() => {
    return uniqueChangedFields.slice(0, isExpanded ? uniqueChangedFields.length : COLLAPSED_ITEMS_COUNT);
  }, [uniqueChangedFields, isExpanded]);

  const onSelectVersion = useCallback(() => onSelect(id), [id, onSelect]);

  const headerStart = useMemo(() => (
    isCurrent
      ? <b>{title}</b>
      : (
        <Button
          data-testid="version-card-title-button"
          buttonStyle="link"
          onClick={onSelectVersion}
        >
          <b>{title}</b>
        </Button>
      )
  ), [isCurrent, onSelectVersion, title]);

  const headerEnd = useMemo(() => (
    <Tooltip
      text={tooltip}
      id={`select-version-${id}-tooltip`}
    >
      {({ ref, ariaIds }) => (
        <IconButton
          ref={ref}
          aria-labelledby={ariaIds.text}
          icon="clock"
          id={`select-version-${id}`}
          disabled={isCurrent}
          onClick={onSelectVersion}
        />
      )}
    </Tooltip>
  ), [id, isCurrent, onSelectVersion, tooltip]);

  const message = useMemo(() => {
    if (isOriginal) {
      return (
        <b>
          <FormattedMessage
            id="stripes-acq-components.versionHistory.card.version.original"
            tagName="em"
          />
        </b>
      );
    }

    if (uniqueChangedFields?.length) {
      return (
        <>
          <FormattedMessage
            id="stripes-acq-components.versionHistory.card.changed"
            tagName="b"
          />
          <List
            items={listItems}
            itemFormatter={itemFormatter}
            listClass={css.changedRecordsList}
            listStyle="bullets"
          />
          {uniqueChangedFields.length > COLLAPSED_ITEMS_COUNT && (
            <Button
              onClick={() => setIsExpanded(prev => !prev)}
              buttonStyle="link"
            >
              {isExpanded
                ? <FormattedMessage id="stripes-acq-components.versionHistory.card.showLess" />
                : <FormattedMessage id="stripes-acq-components.versionHistory.card.showAll" />
              }
            </Button>
          )}
        </>
      );
    }

    return (
      <>
        <FormattedMessage
          id="stripes-acq-components.versionHistory.card.changed"
          tagName="b"
        />
        <FormattedMessage
          id="stripes-acq-components.versionHistory.card.systemChange"
          tagName="div"
        />
      </>
    );
  }, [isOriginal, uniqueChangedFields.length, listItems, isExpanded]);

  return (
    <Card
      id={`version-card-${id}`}
      bodyClass={css.versionCardBody}
      cardStyle={isCurrent ? 'default' : 'positive'}
      headerStart={headerStart}
      headerEnd={headerEnd}
      roundedBorder
    >
      <span>{source}</span>

      {isLatest && (
        <span>
          <b>
            <FormattedMessage
              id="stripes-acq-components.versionHistory.card.version.current"
              tagName="em"
            />
          </b>
        </span>
      )}

      <span>{message}</span>
    </Card>
  );
};

VersionCard.propTypes = {
  changedFields: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool,
  isLatest: PropTypes.bool,
  isOriginal: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  source: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
};

export default memo(VersionCard);
