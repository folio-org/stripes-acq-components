import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import {
  Button,
} from '@folio/stripes/components';

import css from './FileUploader.css';

const defaultRootProps = {
  onClick: e => e.preventDefault(),
};

const FileUploader = ({ onSelectFile }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onSelectFile(acceptedFiles[0]);
    },
    [onSelectFile],
  );

  return (
    <Dropzone
      onDrop={onDrop}
      multiple={false}
    >
      {
        ({ getRootProps, getInputProps, open }) => (
          <div {...getRootProps(defaultRootProps)}>
            <div className={css.fileUploader}>
              <input {...getInputProps()} />

              <div className={css.fileUploaderTitle}>
                <FormattedMessage id="stripes-acq-components.fileUploader.dropFile" />
              </div>

              <Button
                buttonStyle="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                <FormattedMessage id="stripes-acq-components.fileUploader.selectFile" />
              </Button>
            </div>
          </div>
        )
      }
    </Dropzone>
  );
};

FileUploader.propTypes = {
  onSelectFile: PropTypes.func.isRequired,
};

export default FileUploader;
