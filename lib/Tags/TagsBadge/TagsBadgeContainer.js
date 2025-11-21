import PropTypes from 'prop-types';

import { useTagsConfigs } from '../../hooks';
import TagsBadge from './TagsBadge';

const TagsBadgeContainer = ({
  disabled,
  tagsToggle,
  tagsQuantity,
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
  tagsToggle: PropTypes.func.isRequired,
  tagsQuantity: PropTypes.number.isRequired,
};

export default TagsBadgeContainer;
