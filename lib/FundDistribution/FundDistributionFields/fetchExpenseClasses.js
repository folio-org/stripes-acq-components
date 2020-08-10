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
        [fundId]: classes,
      }));
    }
  }

  return classes;
}
