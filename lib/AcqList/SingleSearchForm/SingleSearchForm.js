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
  areaLabelId,
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
    >
      <FormattedMessage
        id={areaLabelId}
      >
        {ariaLabel => (
          <SearchField
            ariaLabel={ariaLabel}
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
  areaLabelId: PropTypes.string.isRequired,
};

SingleSearchForm.defaultProps = {
  searchQuery: '',
  isLoading: true,
};

export default SingleSearchForm;
