/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { isFunction } from 'lodash';

import css from './acqRowFormatter.css';

export function acqRowFormatter(row) {
  const {
    rowIndex,
    rowClass,
    rowData,
    cells,
    rowProps,
    labelStrings,
  } = row;
  const { alignLastColToEnd, ...restRowProps } = rowProps;
  const rowPropsToSet = { ...restRowProps };

  // Default row element
  let Element = 'div';

  // Render a <Link> if a "to"-prop is provided (react-router API)
  if (rowProps.to) {
    Element = Link;

    if (isFunction(rowProps.to)) {
      rowPropsToSet.to = rowProps.to(rowData.id);
    }
  }

  // Render an anchor tag if an "href"-prop is provided
  if (rowProps.href) {
    Element = 'a';

    if (isFunction(rowProps.href)) {
      rowPropsToSet.href = rowProps.href(rowData.id);
    }
  }

  const labelStringsToShow = isFunction(rowProps.labelStrings)
    ? rowProps.labelStrings(row)
    : labelStrings;

  delete rowProps.labelStrings; // We don't want to spread this onto the DOM element.

  // Render a button if an "onClick"-prop is provided
  if (rowProps.onClick) {
    Element = 'button';
  }

  return (
    <Element
      key={`row-${rowIndex}`}
      className={[rowClass, alignLastColToEnd ? css.alignLastColToEnd : null].filter(Boolean).join(' ')}
      aria-label={labelStringsToShow.join('...')}
      role="row"
      {...rowPropsToSet}
      tabIndex="0"
    >
      {cells}
    </Element>
  );
}
