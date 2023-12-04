import { useCategories } from '../useCategories';
import { useTranslatedCategories } from '../useTranslatedCategories';

export const useCategoriesDictionary = () => {
  const { categories, isLoading, isFetching } = useCategories();
  const translatedCategories = useTranslatedCategories(categories);

  return {
    translatedCategories,
    isLoading: isLoading || isFetching,
  };
};
