import { sortBy } from 'lodash';

export async function fetchExpenseClasses({
  fundId,
  mutator,
  fiscalYearId,
  expenseClassesByFundId,
  setExpenseClassesByFundId,
}) {
  let classes = null;

  if (fundId) {
    classes = expenseClassesByFundId[fundId];

    if (fiscalYearId || !classes) {
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
  }

  return classes;
}
