import React from 'react';

import { SelectionFilter } from '../SelectionFilter';
import { fieldSelectOptionShape } from '../shapes';

const LocationFilter = ({ options, ...rest }) => {
  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

LocationFilter.propTypes = {
  options: fieldSelectOptionShape,
};

export default LocationFilter;
