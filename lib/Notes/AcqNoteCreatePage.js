import React from 'react';
import PropTypes from 'prop-types';
import {
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { NoteCreatePage } from '@folio/stripes/smart-components';

import { getReferredEntityData } from './util';

const AcqNoteCreatePage = ({
  domain,
  entityTypeTranslationKeys,
  fallbackPath,
  paneHeaderAppIcon,
}) => {
  const { goBack } = useHistory();
  const { state } = useLocation();
  const referredEntityData = getReferredEntityData(state);

  if (!state) {
    return <Redirect to={fallbackPath} />;
  }

  return (
    <NoteCreatePage
      domain={domain}
      entityTypeTranslationKeys={entityTypeTranslationKeys}
      navigateBack={goBack}
      paneHeaderAppIcon={paneHeaderAppIcon}
      referredEntityData={referredEntityData}
    />
  );
};

AcqNoteCreatePage.propTypes = {
  domain: PropTypes.string.isRequired,
  entityTypeTranslationKeys: PropTypes.object.isRequired,
  fallbackPath: PropTypes.string.isRequired,
  paneHeaderAppIcon: PropTypes.string.isRequired,
};

export default AcqNoteCreatePage;
