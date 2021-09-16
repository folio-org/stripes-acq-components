import { useLocalStorage } from '@rehooks/local-storage';

import { useNamespace } from '@folio/stripes/core';

const useItemToView = (mclKey) => {
  const [namespace] = useNamespace();
  const itemToViewKey = `${namespace}.itemToView${mclKey ? '.' + mclKey : ''}`;

  const [itemToView, setItemToView, delteItemToView] = useLocalStorage(itemToViewKey);

  return { itemToView, setItemToView, delteItemToView };
};

export default useItemToView;
