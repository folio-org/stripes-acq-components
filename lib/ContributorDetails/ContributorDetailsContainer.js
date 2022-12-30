import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { DICT_CONTRIBUTOR_NAME_TYPES } from '../constants';
import { contributorNameTypesManifest } from '../manifests';
import ContributorDetails from './ContributorDetails';

const ContributorDetailsContainer = ({ resources, contributors, mclProps }) => {
  const contributorNameTypes = get(resources, [DICT_CONTRIBUTOR_NAME_TYPES, 'records'], []);

  return (
    <ContributorDetails
      contributorNameTypes={contributorNameTypes}
      contributors={contributors}
      mclProps={mclProps}
    />
  );
};

ContributorDetailsContainer.manifest = Object.freeze({
  [DICT_CONTRIBUTOR_NAME_TYPES]: contributorNameTypesManifest,
});

ContributorDetailsContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object),
  mclProps: PropTypes.object,
};

ContributorDetailsContainer.defaultProps = {
  contributors: [],
};

export default stripesConnect(ContributorDetailsContainer);
