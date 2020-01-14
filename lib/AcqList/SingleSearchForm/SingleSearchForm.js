import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

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
  intl,
}) => {
  const [translatedSearchableIndexes, setTranslatedSearchableIndexes] = useState();

  useEffect(() => {
    const { formatMessage } = intl;

    if (searchableIndexes) {
      setTranslatedSearchableIndexes(
        searchableIndexes.map(index => {
          const label = index.labelId
            ? formatMessage({ id: index.labelId })
            : index.label;

          return { ...index, label };
        }),
      );
    } else {
      setTranslatedSearchableIndexes(undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchableIndexes]);

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
            searchableIndexes={translatedSearchableIndexes}
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
  intl: intlShape.isRequired,
};

SingleSearchForm.defaultProps = {
  searchQuery: '',
  isLoading: false,
  autoFocus: true,
};

export default injectIntl(SingleSearchForm);
