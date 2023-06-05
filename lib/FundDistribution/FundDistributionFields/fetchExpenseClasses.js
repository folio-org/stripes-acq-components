import { sortBy } from 'lodash';

export async function fetchExpenseClasses({
  fundId,
  mutator,
  fiscalYearId,
  setExpenseClassesByFundId,
}) {
  let classes = null;

  if (fundId) {
    try {
      classes = await mutator.GET({
        path: `finance/funds/${fundId}/expense-classes`,
        params: {
          status: 'Active',
          fiscalYearId,
        },
      });
    } catch {
      classes = [];
    }

    setExpenseClassesByFundId((prevClasses) => ({
      ...prevClasses,
      [fundId]: sortBy(classes, ({ name }) => name.toLowerCase()),
    }));
  }

  return classes;
}
