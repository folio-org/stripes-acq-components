// eslint-disable-next-line import/prefer-default-export
export const generateQueryTemplate = (queryFieldNames) => {
  const queryList = queryFieldNames.map(name => `${name}="%{query.query}*"`);

  return `(${queryList.join(' OR ')})`;
};
