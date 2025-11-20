import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  SearchField,
} from '@folio/stripes/components';

import css from './SingleSearchForm.css';

const SingleSearchForm = ({
  applySearch,
  ariaLabelId,
  autoFocus = true,
  changeSearch,
  changeSearchIndex,
  disabled = false,
  indexRef,
  inputRef,
  inputType,
  isLoading = false,
  searchQuery = '',
  searchableIndexes,
  searchableIndexesPlaceholder,
  searchableOptions = null,
  selectedIndex,
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

  const ariaLabel = useMemo(() => intl.formatMessage({ id: ariaLabelId }), [ariaLabelId, intl]);

  const isSubmitDisabled = disabled || !searchQuery || isLoading;

  return (
    <form
      onSubmit={submitSearch}
      data-test-single-search-form
      data-testid="search-form"
    >
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
        searchableOptions={searchableOptions}
        searchableIndexesPlaceholder={searchableIndexesPlaceholder}
        selectedIndex={selectedIndex}
        indexRef={indexRef}
        inputRef={inputRef}
        inputType={inputType}
        lockWidth
        newLineOnShiftEnter
        onSubmitSearch={submitSearch}
      />

      <Button
        buttonStyle="primary"
        data-test-single-search-form-submit
        disabled={isSubmitDisabled}
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
  ariaLabelId: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
  changeSearch: PropTypes.func.isRequired,
  changeSearchIndex: PropTypes.func,
  disabled: PropTypes.bool,
  indexRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  inputType: PropTypes.string,
  isLoading: PropTypes.bool,
  searchQuery: PropTypes.string,
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    labelId: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderId: PropTypes.string,
    value: PropTypes.string,
  })),
  searchableIndexesPlaceholder: PropTypes.string,
  searchableOptions: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  selectedIndex: PropTypes.string,
};

export default SingleSearchForm;
