import React, { useContext } from 'react';

import { showCallout, showToast } from '../utils';

export const ToastContext = React.createContext();

export const useShowToast = () => showToast.bind({ callout: useContext(ToastContext) });
export const useShowCallout = () => showCallout.bind({ callout: useContext(ToastContext) });
