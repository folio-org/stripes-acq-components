import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  SearchField,
  SRStatus,
} from '@folio/stripes/components';

import css from './SingleSearchForm.css';

const SRStatusRef = createRef();

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
  resultsCount,
}) => {
  const [translatedSearchableIndexes, setTranslatedSearchableIndexes] = useState();
  const intl = useIntl();

  useEffect(() => {
    const { formatMessage } = intl;

    if (searchableIndexes) {
      setTranslatedSearchableIndexes(
        searchableIndexes.map(({ labelId, placeholderId, ...index }) => {
          const label = labelId
            ? formatMessage({ id: labelId })
            : index.label;
          const placeholder = placeholderId
            ? formatMessage({ id: placeholderId })
            : index.placeholder;

          return { ...index, label, placeholder };
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

  useEffect(() => {
    if (!isLoading && Number.isInteger(resultsCount)) {
      SRStatusRef.current.sendMessage(intl.formatMessage(
        { id: 'stripes-acq-components.search.resultsCount' },
        { resultsCount },
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, resultsCount]);

  const ariaLabel = useMemo(() => intl.formatMessage({ id: ariaLabelId }), [ariaLabelId, intl]);

  return (
    <form
      onSubmit={submitSearch}
      data-test-single-search-form
      data-testid="search-form"
    >
      <SRStatus ref={SRStatusRef} />

      <SearchField
        ariaLabel={ariaLabel}
        autoFocus={autoFocus}
        className={css.searchField}
        value={searchQuery}
        id="input-record-search"
        loading={isLoading}
        marginBottom0
        onChange={changeSearch}
        onChangeIndex={changeSearchIndex}
        onClear={reset}
        searchableIndexes={translatedSearchableIndexes}
        selectedIndex={selectedIndex}
      />

      <Button
        buttonStyle="primary"
        data-test-single-search-form-submit
        disabled={!searchQuery || isLoading}
        fullWidth
        type="submit"
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
    labelId: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderId: PropTypes.string,
    value: PropTypes.string,
  })),
  selectedIndex: PropTypes.string,
  changeSearchIndex: PropTypes.func,
  resultsCount: PropTypes.number,
};

SingleSearchForm.defaultProps = {
  searchQuery: '',
  isLoading: false,
  autoFocus: true,
};

export default SingleSearchForm;
