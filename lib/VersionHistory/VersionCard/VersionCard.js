import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Card,
  IconButton,
  List,
  Tooltip,
} from '@folio/stripes/components';

import css from './VersionCard.css';

const itemFormatter = (item, i) => (<li key={i} className={css.changedRecord}>{item}</li>);

const VersionCard = ({
  changes,
  id,
  isCurrent,
  onSelect,
  source,
  title,
}) => {
  const intl = useIntl();

  const tooltip = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.card.select.tooltip' });

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
          onClick={() => onSelect(id)}
        />
      )}
    </Tooltip>
  ), [id, isCurrent, onSelect, tooltip]);

  return (
    <Card
      id={`version-card-${id}`}
      bodyClass={css.versionCardBody}
      cardStyle={isCurrent ? 'default' : 'positive'}
      headerStart={<b>{title}</b>}
      headerEnd={headerEnd}
      roundedBorder
    >
      <span>{source}</span>

      {isCurrent && (
        <span>
          <b>
            <FormattedMessage
              id="stripes-acq-components.versionHistory.card.version.current"
              tagName="em"
            />
          </b>
        </span>
      )}

      <span>
        {
          changes
            ? (
              <>
                <FormattedMessage
                  id="stripes-acq-components.versionHistory.card.changed"
                  tagName="b"
                />
                <List
                  items={changes}
                  itemFormatter={itemFormatter}
                  listClass={css.changedRecordsList}
                  listStyle="bullets"
                />
              </>
            )
            : (
              <FormattedMessage
                id="stripes-acq-components.versionHistory.card.version.original"
                tagName="b"
              />
            )
        }
      </span>
    </Card>
  );
};

VersionCard.propTypes = {
  changes: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  source: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default memo(VersionCard);
