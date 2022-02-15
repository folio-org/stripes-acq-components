import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { MenuSection } from '@folio/stripes/components';

export const FilterMenu = ({
  children,
  prefix,
}) => {
  const intl = useIntl();

  return (
    <MenuSection
      label={intl.formatMessage({ id: 'stripes-acq-components.filter.placeholder' })}
      id={`${prefix}-filter-menu-section`}
    >
      {children}
    </MenuSection>
  );
};

FilterMenu.propTypes = {
  children: PropTypes.node.isRequired,
  prefix: PropTypes.string.isRequired,
};
