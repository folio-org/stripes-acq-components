import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useAccordionToggle } from './useAccordionToggle';

// eslint-disable-next-line react/prop-types
const HookWrapper = ({ defaultSections, section, options = {} }) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle(defaultSections, options);

  return (
    <>
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
    </>
  );
};

const renderWrapper = (defaultSections, section, options) => (render(
  <HookWrapper
    defaultSections={defaultSections}
    section={section}
    options={options}
  />,
));

describe('useAccordionToggle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should change opposite value for section when toggleSection is fired', async () => {
    const { getByTestId } = renderWrapper(defaultSections, section);

    await userEvent.click(getByTestId('expand-accordion'));

    expect(getByTestId('accordion-sections').getAttribute('data-section')).toBe('false');
  });

  it('should set up passed sections when expandAll is fired', async () => {
    const { getByTestId } = renderWrapper(defaultSections, section);

    await userEvent.click(getByTestId('expand-accordion'));
    await userEvent.click(getByTestId('expand-all-accordions'));

    expect(getByTestId('accordion-sections').getAttribute('data-section')).toBe('true');
  });

  it('should not close an accordion if there are validation errors for its fields', async () => {
    const options = {
      fieldsMap: { field: section },
      errors: { field: 'validation error' },
    };

    const { getByTestId } = renderWrapper(defaultSections, section, options);

    userEvent.click(getByTestId('expand-accordion'));

    expect(getByTestId('accordion-sections').getAttribute('data-section')).toBe('true');
  });
});
