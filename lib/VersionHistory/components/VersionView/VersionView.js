import PropTypes from 'prop-types';
import {
  memo,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  LoadingPane,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import { TagsBadge } from '../../../Tags';
import { VersionHistoryButton } from '../../VersionHistoryButton';

const VersionView = ({
  children,
  id,
  isLoading,
  onClose,
  tags,
  versionId,
  ...props
}) => {
  const isVersionExist = Boolean(versionId && !isLoading);

  const lastMenu = useMemo(() => (
    <PaneMenu>
      {tags && (
        <TagsBadge
          disabled
          tagsQuantity={tags.length}
        />
      )}
      <VersionHistoryButton disabled />
    </PaneMenu>
  ), [tags]);

  if (isLoading) return <LoadingPane />;

  return (
    <Pane
      id={`${id}-version-view`}
      defaultWidth="fill"
      onClose={onClose}
      lastMenu={lastMenu}
      {...props}
    >
      {
        isVersionExist
          ? children
          : (
            <Layout
              element="span"
              className="flex centerContent"
            >
              <FormattedMessage id="stripes-acq-components.versionHistory.noVersion" />
            </Layout>
          )
      }
    </Pane>
  );
};

VersionView.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.object),
  versionId: PropTypes.string,
};

export default memo(VersionView);
