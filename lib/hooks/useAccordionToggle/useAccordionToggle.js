import { useCallback, useMemo, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useAccordionToggle = (
  defaultSections = {},
  {
    fieldsMap = {},
    errors = {},
  } = {},
) => {
  const [stateSections, setSections] = useState(defaultSections);

  const errorAccordions = useMemo(() => (
    Object.keys(errors).map(
      (fieldName) => ({ [fieldsMap[fieldName]]: true }),
    )
  ), [errors, fieldsMap]);

  const sections = useMemo(() => (
    errorAccordions.length
      ? {
        ...stateSections,
        ...(errorAccordions.reduce((acc, section) => ({ ...acc, ...section }), {})),
      }
      : stateSections
  ), [errorAccordions, stateSections]);

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
