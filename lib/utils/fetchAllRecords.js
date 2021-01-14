export const fetchAllRecords = async (mutator, query) => {
  const { GET, reset } = mutator;

  const limit = 1000;
  const data = [];
  let offset = 0;
  let hasData = true;

  while (hasData) {
    try {
      reset();
      // eslint-disable-next-line no-await-in-loop
      const result = await GET({ params: { query, limit, offset } });

      hasData = result.length;
      offset += limit;
      if (hasData) {
        data.push(...result);
      }
    } catch (err) {
      hasData = false;
    }
  }

  return data;
};
