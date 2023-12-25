import React from 'react';
import { FormattedMessage } from 'react-intl';

export const PIECE_STATUS = {
  expected: 'Expected',
  received: 'Received',
  late: 'Late',
  claimDelayed: 'Claim delayed',
  claimSent: 'Claim sent',
  unreceivable: 'Unreceivable',
};

export const PIECE_FORMAT = {
  electronic: 'Electronic',
  physical: 'Physical',
  other: 'Other',
};

export const PIECE_FORMAT_LABELS = {
  [PIECE_FORMAT.electronic]: <FormattedMessage id="stripes-acq-components.piece.pieceFormat.electronic" />,
  [PIECE_FORMAT.physical]: <FormattedMessage id="stripes-acq-components.piece.pieceFormat.physical" />,
  [PIECE_FORMAT.other]: <FormattedMessage id="stripes-acq-components.piece.pieceFormat.other" />,
};

export const PIECE_FORMAT_OPTIONS = [
  { labelId: 'stripes-acq-components.piece.pieceFormat.electronic', value: PIECE_FORMAT.electronic },
  { labelId: 'stripes-acq-components.piece.pieceFormat.physical', value: PIECE_FORMAT.physical },
  { labelId: 'stripes-acq-components.piece.pieceFormat.other', value: PIECE_FORMAT.other },
];

export const PIECE_STATUS_OPTIONS = Object.keys(PIECE_STATUS).map(status => ({
  value: PIECE_STATUS[status],
  label: <FormattedMessage id={`stripes-acq-components.piece.pieceStatus.${status}`} />,
}));
