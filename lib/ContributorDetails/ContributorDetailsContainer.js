import PropTypes from 'prop-types';

import { useContributorNameTypes } from '../hooks';
import ContributorDetails from './ContributorDetails';

const ContributorDetailsContainer = ({
  contributors,
  mclProps,
  name,
  tenantId,
}) => {
  const { contributorNameTypes } = useContributorNameTypes({ tenantId });

  return (
    <ContributorDetails
      contributorNameTypes={contributorNameTypes}
      contributors={contributors}
      mclProps={mclProps}
      name={name}
    />
  );
};

ContributorDetailsContainer.propTypes = {
  contributors: PropTypes.arrayOf(PropTypes.object),
  mclProps: PropTypes.object,
  name: PropTypes.string,
  tenantId: PropTypes.string,
};

ContributorDetailsContainer.defaultProps = {
  contributors: [],
};

export default ContributorDetailsContainer;
