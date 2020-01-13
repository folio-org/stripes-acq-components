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
  searchableIndexes,
  selectedIndex,
  changeSearchIndex,
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
            onChangeIndex={changeSearchIndex}
            onClear={reset}
            placeholder={ariaLabel}
            searchableIndexes={searchableIndexes}
            selectedIndex={selectedIndex}
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
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  })),
  selectedIndex: PropTypes.string,
  changeSearchIndex: PropTypes.func,
};

SingleSearchForm.defaultProps = {
  searchQuery: '',
  isLoading: false,
  autoFocus: true,
};

export default SingleSearchForm;
