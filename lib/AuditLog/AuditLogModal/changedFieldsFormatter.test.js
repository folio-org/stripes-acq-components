import { render, screen } from '@testing-library/react';

import changedFieldsFormatter from './changedFieldsFormatter';

const renderChangedFieldsFormatter = ({
  fieldValue,
  fieldName,
  listItemFormatter,
  fieldFormatter,
}) => {
  const component = (
    <div>
      {changedFieldsFormatter({ fieldValue, fieldName, listItemFormatter, fieldFormatter })}
    </div>
  );

  return render(component);
};

describe('changedFieldsFormatter', () => {
  it('should render \'-\' if no field value is provided', () => {
    renderChangedFieldsFormatter({
      fieldValue: null,
    });

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render field value as a string if it is not an object', () => {
    renderChangedFieldsFormatter({
      fieldValue: 'field value',
    });

    expect(screen.getByText('field value')).toBeInTheDocument();
  });

  it('should correctly format field value if formatter is provided', () => {
    renderChangedFieldsFormatter({
      fieldValue: 'field value',
      fieldName: 'fieldName',
      fieldFormatter: { fieldName: value => `${value} extra info` },
    });

    expect(screen.getByText('field value extra info')).toBeInTheDocument();
  });

  it('should render List of field changes if field value is object', () => {
    const itemFormatter = (field, i) => {
      return (
        <li key={i}>
          {field.value}
        </li>
      );
    };

    renderChangedFieldsFormatter({
      fieldValue: { field1: 'value 1', field2: 'value 2', field3: 'value 3' },
      listItemFormatter: itemFormatter,
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('value 1')).toBeInTheDocument();
    expect(screen.getByText('value 2')).toBeInTheDocument();
    expect(screen.getByText('value 3')).toBeInTheDocument();
  });
});
