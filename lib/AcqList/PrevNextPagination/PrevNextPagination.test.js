import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import { PrevNextPagination } from './PrevNextPagination';

const renderPrevNextPagination = (props = {}) => (render(
  <PrevNextPagination
    {...props}
  />,
));

const defaultPagination = {
  totalCount: 30, offset: 10, limit: 10,
};

describe('PrevNextPagination', () => {
  it('should not call onChange when pagination is disabled and prev button is called', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderPrevNextPagination({ ...defaultPagination, onChange, disabled: true });

    user.click(getByTestId('prev-page-button'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not call onChange when pagination is disabled and next button is called', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderPrevNextPagination({ ...defaultPagination, onChange, disabled: true });

    user.click(getByTestId('next-page-button'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not call onChange when first page is opened and prev button is called', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderPrevNextPagination({ ...defaultPagination, onChange, offset: 0 });

    user.click(getByTestId('prev-page-button'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not call onChange when last page is opened and next button is called', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderPrevNextPagination({
      ...defaultPagination,
      onChange,
      offset: defaultPagination.totalCount,
    });

    user.click(getByTestId('next-page-button'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should call onChange when next button is called', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderPrevNextPagination({ ...defaultPagination, onChange });

    user.click(getByTestId('next-page-button'));

    expect(onChange).toHaveBeenCalledWith({
      limit: defaultPagination.limit,
      offset: defaultPagination.offset + defaultPagination.limit,
    });
  });

  it('should call onChange when prev button is called', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderPrevNextPagination({ ...defaultPagination, onChange });

    user.click(getByTestId('prev-page-button'));

    expect(onChange).toHaveBeenCalledWith({
      limit: defaultPagination.limit,
      offset: defaultPagination.offset - defaultPagination.limit,
    });
  });
});
