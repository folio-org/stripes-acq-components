import { useLocalStorage } from '@rehooks/local-storage';

import { useNamespace } from '@folio/stripes/core';

export const useItemToView = (persistKey) => {
  const [namespace] = useNamespace();
  const itemToViewKey = `${namespace}.itemToView${persistKey ? '.' + persistKey : ''}`;

  const [itemToView, setItemToView, deleteItemToView] = useLocalStorage(itemToViewKey);

  return { itemToView, setItemToView, deleteItemToView };
};
