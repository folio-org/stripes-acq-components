import React from 'react';
import { FormattedMessage } from 'react-intl';

const commandsMap = {
  new: 'alt+n',
  edit: 'mod+alt+e',
  save: 'mod+s',
  expandCollapse: 'spacebar',
  expandAllSections: 'mod+alt+b',
  collapseAllSections: 'mod+alt+g',
  search: 'mod+alt+h',
  openShortcutModal: 'mod+alt+k',
};

export const acqCommands = Object.entries(commandsMap).map(([name, shortcut]) => ({
  name,
  label: <FormattedMessage id={`stripes-acq-components.shortcut.${name}`} />,
  shortcut,
}));
