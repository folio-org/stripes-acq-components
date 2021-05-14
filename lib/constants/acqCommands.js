import React from 'react';
import { FormattedMessage } from 'react-intl';

export const acqCommands = [
  {
    name: 'new',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.createRecord" />),
    shortcut: 'alt+n',
  },
  {
    name: 'edit',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.editRecord" />),
    shortcut: 'mod+alt+e',
  },
  {
    name: 'save',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.saveRecord" />),
    shortcut: 'mod+s',
  },
  {
    name: 'expandCollapse',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.expandCollapse" />),
    shortcut: 'spacebar',
  },
  {
    name: 'expandAllSections',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.expandAll" />),
    shortcut: 'mod+alt+b',
  },
  {
    name: 'collapseAllSections',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.collapseAll" />),
    shortcut: 'mod+alt+g',
  },
  {
    name: 'search',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.goToSearchFilter" />),
    shortcut: 'mod+alt+h',
  },
  {
    name: 'close',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.closeModal" />),
    shortcut: 'esc',
  },
  {
    name: 'copy',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.copy" />),
    shortcut: 'mod+c',
  },
  {
    name: 'cut',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.cut" />),
    shortcut: 'mod+x',
  },
  {
    name: 'paste',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.paste" />),
    shortcut: 'mod+v',
  },
  {
    name: 'find',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.find" />),
    shortcut: 'mod+f',
  },
  {
    name: 'openShortcutModal',
    label: (<FormattedMessage id="stripes-acq-components.shortcut.find" />),
    shortcut: 'mod+alt+k',
  },
];
