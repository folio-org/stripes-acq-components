import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { acqRowFormatter } from './acqRowFormatter';
import css from './acqRowFormatter.css';

const rowIndex = 0;
const TEST_ID = 'test-row';

const renderFnResult = (alignLastColToEnd) => (render(
  <>
    {acqRowFormatter({
      cells: <div>cells</div>,
      labelStrings: [],
      rowProps: {
        alignLastColToEnd,
        'data-testid': TEST_ID,
      },
      rowIndex,
    })}
  </>,
));

describe('acqRowFormatter', () => {
  afterEach(cleanup);

  it('should have class to align cells to the end', () => {
    const { getByTestId } = renderFnResult(true);

    expect(getByTestId(TEST_ID).classList.contains(css.alignLastColToEnd)).toBe(true);
  });

  it('should not have class to align cells to the end', () => {
    const { getByTestId } = renderFnResult();

    expect(getByTestId(TEST_ID).classList.contains(css.alignLastColToEnd)).toBe(false);
  });
});
