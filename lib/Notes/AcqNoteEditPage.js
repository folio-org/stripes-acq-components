import React, { useCallback } from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import { NoteEditPage } from '@folio/stripes/smart-components';

import { getReferredEntityData } from './util';

const AcqNoteEditPage = ({
  domain,
  entityTypePluralizedTranslationKeys,
  entityTypeTranslationKeys,
  notesPath,
  paneHeaderAppIcon,
}) => {
  const history = useHistory();
  const { state } = useLocation();
  const { id } = useParams();
  const goToNoteView = useCallback(
    () => {
      history.replace({
        pathname: `${notesPath}/${id}`,
        state,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const referredEntityData = getReferredEntityData(state);

  return (
    <NoteEditPage
      domain={domain}
      entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
      entityTypeTranslationKeys={entityTypeTranslationKeys}
      navigateBack={goToNoteView}
      noteId={id}
      paneHeaderAppIcon={paneHeaderAppIcon}
      referredEntityData={referredEntityData}
    />
  );
};

AcqNoteEditPage.propTypes = {
  domain: PropTypes.string.isRequired,
  entityTypePluralizedTranslationKeys: PropTypes.object.isRequired,
  entityTypeTranslationKeys: PropTypes.object.isRequired,
  notesPath: PropTypes.string.isRequired,
  paneHeaderAppIcon: PropTypes.string.isRequired,
};

export default AcqNoteEditPage;
