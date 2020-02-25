import React from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { fieldSelectOptionsShape } from '../shapes';

const LocationFilter = ({ options, ...rest }) => {
  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

LocationFilter.propTypes = {
  options: fieldSelectOptionsShape,
};

export default LocationFilter;
