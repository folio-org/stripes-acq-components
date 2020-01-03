import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
} from '@folio/stripes/components';

const ResultsPane = ({ children, width, title, subTitle, count, renderLastMenu }) => {
  const paneSub = (
    <FormattedMessage
      id="stripes-smart-components.searchResultsCountHeader"
      values={{ count }}
    />
  );

  return (
    <Pane
      defaultWidth={width}
      paneTitle={title}
      paneSub={subTitle || paneSub}
      padContent={false}
      noOverflow
      lastMenu={renderLastMenu && renderLastMenu()}
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
  count: PropTypes.number,
  renderLastMenu: PropTypes.func,
};

ResultsPane.defaultProps = {
  width: 'fill',
  subTitle: '',
  count: 0,
};

export default ResultsPane;
