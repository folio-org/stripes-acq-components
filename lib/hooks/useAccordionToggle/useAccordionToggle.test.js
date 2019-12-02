import React, { Fragment } from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import { useAccordionToggle } from './useAccordionToggle';

// eslint-disable-next-line react/prop-types
const HookWrapper = ({ defaultSections, section }) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle(defaultSections);

  return (
    <Fragment>
      <button
        type="button"
        onClick={() => expandAll(defaultSections)}
        data-testid="expand-all-accordions"
      >
        Expand all
      </button>
      <button
        type="button"
        onClick={() => toggleSection({ id: section })}
        data-testid="expand-accordion"
      >
        Toggle accordion
      </button>
      <span
        data-section={sections[section]}
        data-testid="accordion-sections"
      />
    </Fragment>
  );
};

const renderWrapper = (defaultSections, section) => (render(
  <HookWrapper
    defaultSections={defaultSections}
    section={section}
  />,
));

describe('useAccordionToggle', () => {
  afterEach(cleanup);

  let defaultSections;
  let section;

  beforeEach(() => {
    section = 'orderDetails';
    defaultSections = {
      [section]: true,
    };
  });

  it('should set up default value', () => {
    const { getByTestId } = renderWrapper(defaultSections, section);

    expect(getByTestId('accordion-sections').getAttribute('data-section')).toBe('true');
  });

  it('should change opposite value for section when toggleSection is fired', () => {
    const { getByTestId } = renderWrapper(defaultSections, section);

    fireEvent(getByTestId('expand-accordion'), new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    expect(getByTestId('accordion-sections').getAttribute('data-section')).toBe('false');
  });

  it('should set up passed sections when expandAll is fired', () => {
    const { getByTestId } = renderWrapper(defaultSections, section);

    fireEvent(getByTestId('expand-accordion'), new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    fireEvent(getByTestId('expand-all-accordions'), new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));
    expect(getByTestId('accordion-sections').getAttribute('data-section')).toBe('true');
  });
});
