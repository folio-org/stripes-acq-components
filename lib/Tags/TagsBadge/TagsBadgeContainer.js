import PropTypes from 'prop-types';

import { useTagsConfigs } from '../../hooks';
import TagsBadge from './TagsBadge';

const TagsBadgeContainer = ({
  disabled,
  tagsQuantity,
  tagsToggle,
}) => {
  const { configs } = useTagsConfigs();
  const tagsEnabled = !configs.length || configs[0].value === true;

  return (
    <TagsBadge
      disabled={disabled}
      tagsEnabled={tagsEnabled}
      tagsToggle={tagsToggle}
      tagsQuantity={tagsQuantity}
    />
  );
};

TagsBadgeContainer.propTypes = {
  disabled: PropTypes.bool,
  tagsQuantity: PropTypes.number.isRequired,
  tagsToggle: PropTypes.func.isRequired,
};

export default TagsBadgeContainer;
