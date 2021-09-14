import { getHoldingLocationName } from './utils';

const holding = { permanentLocationId: '001' };
const location = { id: '001', name: 'Annex' };
const locationsMap = { [location.id]: location };

describe('getHoldingLocationName', () => {
  it('should return location name', async () => {
    const locationName = await getHoldingLocationName(holding, locationsMap);

    expect(locationName).toEqual(location.name);
  });
});
