import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './PrevNextPagination.css';

export const PrevNextPagination = ({
  totalCount,
  limit,
  offset,
  disabled,
  onChange,
}) => {
  const nextOffset = offset + limit;

  const handlePrevPage = () => {
    onChange({ limit, offset: offset - limit });
  };

  const handleNextPage = () => {
    onChange({ limit, offset: nextOffset });
  };

  return (
    <div className={css.prevNextPaginationContainer}>
      <Button
        onClick={handlePrevPage}
        disabled={disabled || !offset}
        buttonStyle="none"
        bottomMargin0
      >
        <Icon size="small" icon="caret-left" iconPosition="start">
          <span>
            <FormattedMessage id="stripes-components.previous" />
          </span>
        </Icon>
      </Button>

      <div>
        {offset + 1} - {nextOffset > totalCount ? totalCount : nextOffset}
      </div>

      <Button
        onClick={handleNextPage}
        disabled={disabled || nextOffset >= totalCount}
        buttonStyle="none"
        bottomMargin0
      >
        <Icon size="small" icon="caret-right" iconPosition="end">
          <span>
            <FormattedMessage id="stripes-components.next" />
          </span>
        </Icon>
      </Button>
    </div>
  );
};

PrevNextPagination.HEIGHT = 45;

PrevNextPagination.propTypes = {
  offset: PropTypes.number,
  limit: PropTypes.number,
  totalCount: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
