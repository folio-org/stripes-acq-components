import React from 'react';
import PropTypes from 'prop-types';

import {
  Layout,
  EndOfList,
} from '@folio/stripes/components';

import css from './AcqEndOfList.css';

function AcqEndOfList({ noPaddingBottom, totalCount }) {
  if (!totalCount) return null;

  return (
    <Layout className={`textCentered ${noPaddingBottom ? css.noPaddingBottom : ''}`}>
      <EndOfList />
    </Layout>
  );
}

AcqEndOfList.propTypes = {
  noPaddingBottom: PropTypes.bool,
  totalCount: PropTypes.number,
};

AcqEndOfList.defaultProps = {
  noPaddingBottom: true,
};

export default AcqEndOfList;
