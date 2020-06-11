import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { acqRowFormatter } from './acqRowFormatter';
import css from './acqRowFormatter.css';

const rowIndex = 0;
const TEST_ID = 'test-row';

const renderFnResult = (rowProps) => (render(
  <>
    {acqRowFormatter({
      cells: <div>cells</div>,
      labelStrings: [],
      rowProps: {
        'data-testid': TEST_ID,
        ...rowProps,
      },
      rowIndex,
    })}
  </>,
));

describe('acqRowFormatter', () => {
  afterEach(cleanup);

  it('should have class to align cells to the end', () => {
    const { getByTestId } = renderFnResult({ alignLastColToEnd: true });

    expect(getByTestId(TEST_ID).tagName).toEqual('DIV');
    expect(getByTestId(TEST_ID).classList.contains(css.alignLastColToEnd)).toBe(true);
  });

  it('should not have class to align cells to the end', () => {
    const { getByTestId } = renderFnResult({});

    expect(getByTestId(TEST_ID).classList.contains(css.alignLastColToEnd)).toBe(false);
  });

  it('should render a div (earlier was button)', () => {
    const { getByTestId } = renderFnResult({ onClick: () => { } });

    expect(getByTestId(TEST_ID).tagName).toEqual('DIV');
  });

  it('should render an anchor', () => {
    const { getByTestId } = renderFnResult({ href: '#someLink' });

    expect(getByTestId(TEST_ID).tagName).toEqual('A');
  });
});
