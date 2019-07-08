import React from 'react';

import { AcqCheckboxFilter } from '../AcqCheckboxFilter';
import { sourceOptions } from '../constants';
import { selectOptionShape } from '../shapes';

const SourceFilter = (props) => (
  <AcqCheckboxFilter
    labelId="stripes-acq-components.label.sourceFilter"
    options={sourceOptions}
    {...props}
  />
);

SourceFilter.propTypes = {
  sourceOptions: selectOptionShape,
};

export default SourceFilter;
