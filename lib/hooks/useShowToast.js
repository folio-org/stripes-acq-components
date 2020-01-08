import React, { useContext } from 'react';

import { showCallout, showToast } from '../utils';

export const ToastContext = React.createContext();

// Deprecated, use `showCallout` instead
export const useShowToast = () => showToast.bind({ callout: useContext(ToastContext) });

export const useShowCallout = () => showCallout.bind({ callout: useContext(ToastContext) });
