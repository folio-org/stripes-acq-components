import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  SearchField,
} from '@folio/stripes/components';

import css from './SingleSearchForm.css';

const SingleSearchForm = ({
  applySearch,
  changeSearch,
  searchQuery,
  isLoading,
  ariaLabelId,
  autoFocus,
}) => {
  const reset = useCallback(
    () => changeSearch({ target: { value: '' } }),
    [changeSearch],
  );

  const submitSearch = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      applySearch();
    },
    [applySearch],
  );

  return (
    <form
      onSubmit={submitSearch}
      data-test-single-search-form
    >
      <FormattedMessage
        id={ariaLabelId}
      >
        {ariaLabel => (
          <SearchField
            ariaLabel={ariaLabel}
            autoFocus={autoFocus}
            className={css.searchField}
            value={searchQuery}
            loading={isLoading}
            marginBottom0
            onChange={changeSearch}
            onClear={reset}
          />
        )}
      </FormattedMessage>

      <Button
        type="submit"
        buttonStyle="primary"
        fullWidth
        disabled={!searchQuery}
      >
        <FormattedMessage id="stripes-acq-components.search" />
      </Button>
    </form>
  );
};

SingleSearchForm.propTypes = {
  applySearch: PropTypes.func.isRequired,
  changeSearch: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  isLoading: PropTypes.bool,
  ariaLabelId: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
};

SingleSearchForm.defaultProps = {
  searchQuery: '',
  isLoading: false,
  autoFocus: true,
};

export default SingleSearchForm;
