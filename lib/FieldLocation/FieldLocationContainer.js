import React from 'react';

import { FieldSelection } from '../FieldSelection';
import FieldLocationFinalContainer from './FieldLocationFinalContainer';

const FieldLocationContainer = (props) => {
  return (
    <FieldLocationFinalContainer
      fieldComponent={FieldSelection}
      {...props}
    />
  );
};

export default FieldLocationContainer;
