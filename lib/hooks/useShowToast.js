import React, { useContext } from 'react';

import { showToast } from '../utils';

export const ToastContext = React.createContext();

export const useShowToast = () => showToast.bind({ callout: useContext(ToastContext) });
