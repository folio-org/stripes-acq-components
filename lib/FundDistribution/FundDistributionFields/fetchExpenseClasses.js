import { sortBy } from 'lodash';

export async function fetchExpenseClasses(fundId, expenseClassesByFundId, setExpenseClassesByFundId, mutator) {
  let classes = null;

  if (fundId) {
    classes = expenseClassesByFundId[fundId];

    if (!classes) {
      try {
        classes = await mutator.GET({ path: `finance/funds/${fundId}/expense-classes` });
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
