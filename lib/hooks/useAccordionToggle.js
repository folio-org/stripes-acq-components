import { useCallback, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useAccordionToggle = (defaultSections = {}) => {
  const [sections, setSections] = useState(defaultSections);

  const toggleSection = useCallback(
    ({ id }) => {
      setSections(prevSections => ({ ...prevSections, [id]: !prevSections[id] }));
    }, [],
  );

  const expandAll = useCallback(
    (expandedSections) => setSections(expandedSections),
    [],
  );

  return [
    expandAll,
    sections,
    toggleSection,
  ];
};
