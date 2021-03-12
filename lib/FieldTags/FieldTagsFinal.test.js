import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import FieldTagsFinal from './FieldTagsFinal';

const allTags = [{ id: '1', label: 'tag1' }, { id: '2', label: 'tag2' }];

// eslint-disable-next-line react/prop-types
const renderForm = () => (
  <form>
    <FieldTagsFinal
      allTags={allTags}
      name="tags"
      onAdd={() => { }}
      formValues={{}}
    />
  </form>
);

const FormCmpt = stripesFinalForm({})(renderForm);

const renderComponent = (props = {}) => (render(
  <MemoryRouter>
    <FormCmpt onSubmit={() => { }} initialValues={{ 'tags': props.tags || [] }} {...props} />
  </MemoryRouter>,
));

describe('FieldTagsFinal', () => {
  it('should add new record and assign it', async () => {
    renderComponent();
    expect(screen.getByText('0 items selected')).toBeDefined();
    user.click(screen.getByText('tag1'));
    expect(screen.getByText('1 item selected')).toBeDefined();
  });

  it('should display preselected tags and handle clicks', () => {
    const tags = ['tag1', 'tag2'];

    renderComponent({ formValues: { tags }, tags });

    expect(screen.getByText('2 items selected')).toBeDefined();
    user.click(screen.getAllByLabelText('times')[0]);
    expect(screen.getByText('1 item selected')).toBeDefined();
  });
});
