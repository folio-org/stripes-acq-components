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
  close: 'esc',
  copy: 'mod+c',
  cut: 'mod+x',
  paste: 'mod+v',
  find: 'mod+f',
  openShortcutModal: 'mod+alt+k',
};

export const acqCommands = Object.keys(commandsMap).map(k => ({
  name: k,
  label: <FormattedMessage id={`stripes-acq-components.shortcut.${k}`} />,
  shortcut: commandsMap[k],
}));
