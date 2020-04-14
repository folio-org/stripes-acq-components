/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';

import css from './acqRowFormatter.css';

export function acqRowFormatter({ rowIndex, rowClass, cells, rowProps, labelStrings }) {
  // Default row element
  let Element = 'div';

  // Render a <Link> if a "to"-prop is provided (react-router API)
  if (rowProps.to) {
    Element = Link;
  }

  // Render an anchor tag if an "href"-prop is provided
  if (rowProps.href) {
    Element = 'a';
  }

  // Render a button if an "onClick"-prop is provided
  if (rowProps.onClick) {
    Element = 'button';
  }
  const { alignLastColToEnd, ...restRowProps } = rowProps;

  return (
    <Element
      key={`row-${rowIndex}`}
      className={[rowClass, alignLastColToEnd ? css.alignLastColToEnd : null].filter(Boolean).join(' ')}
      aria-label={labelStrings.join('...')}
      role="row"
      {...restRowProps}
      tabIndex="0"
    >
      {cells}
    </Element>
  );
}
