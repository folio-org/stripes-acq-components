import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { NoteViewPage } from '@folio/stripes/smart-components';

import { getReferredEntityData } from './util';

const AcqNoteViewPage = ({
  entityTypePluralizedTranslationKeys,
  entityTypeTranslationKeys,
  fallbackPath,
  notesPath,
  paneHeaderAppIcon,
}) => {
  const history = useHistory();
  const { state } = useLocation();
  const { id } = useParams();
  const onEdit = useCallback(
    () => {
      history.replace({
        pathname: `${notesPath}/${id}/edit`,
        state,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const navigateBack = useCallback(
    () => {
      if (state) {
        history.goBack();
      } else {
        history.push({
          pathname: fallbackPath,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const referredEntityData = getReferredEntityData(state);

  return (
    <div data-test-note-view-container>
      <NoteViewPage
        entityTypePluralizedTranslationKeys={entityTypePluralizedTranslationKeys}
        entityTypeTranslationKeys={entityTypeTranslationKeys}
        navigateBack={navigateBack}
        noteId={id}
        onEdit={onEdit}
        paneHeaderAppIcon={paneHeaderAppIcon}
        referredEntityData={referredEntityData}
      />
    </div>
  );
};

AcqNoteViewPage.propTypes = {
  entityTypePluralizedTranslationKeys: PropTypes.object.isRequired,
  entityTypeTranslationKeys: PropTypes.object.isRequired,
  fallbackPath: PropTypes.string.isRequired,
  notesPath: PropTypes.string.isRequired,
  paneHeaderAppIcon: PropTypes.string.isRequired,
};

export default AcqNoteViewPage;
