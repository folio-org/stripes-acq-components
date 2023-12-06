import { useLocations } from '../hooks';

export const useLocationsRecords = () => {
  const {
    locations,
    isLoading,
  } = useLocations();

  return {
    locations,
    isLoading,
  }
}
