import React from 'react';
import PropTypes from 'prop-types';

import { SelectionFilter } from '../SelectionFilter';

const getFundOptions = (funds = []) => funds.map(fund => ({
  value: fund.id,
  label: fund.code,
}));

const FundFilter = ({ funds, labelId, ...rest }) => {
  const options = getFundOptions(funds);

  return (
    <SelectionFilter
      {...rest}
      options={options}
      labelId={labelId}
    />
  );
};

FundFilter.propTypes = {
  funds: PropTypes.arrayOf(PropTypes.object),
  labelId: PropTypes.string,
};

FundFilter.defaultProps = {
  labelId: 'stripes-acq-components.filter.fundCode',
};

export default FundFilter;
