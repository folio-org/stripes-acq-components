import React from 'react';
import PropTypes from 'prop-types';

import {
  Pane,
} from '@folio/stripes/components';

const ResultsPane = ({ children, width, title, subTitle }) => {
  return (
    <Pane
      defaultWidth={width}
      paneTitle={title}
      paneSub={subTitle}
      padContent={false}
      noOverflow
    >
      {children}
    </Pane>
  );
};

ResultsPane.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node,
  width: PropTypes.string,
};

ResultsPane.defaultProps = {
  width: 'fill',
  subTitle: '',
};

export default ResultsPane;
