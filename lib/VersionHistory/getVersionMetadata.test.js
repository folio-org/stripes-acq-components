import { getVersionMetadata } from './getVersionMetadata';

const version = {
  userId: 'userId',
  actionDate: '2024-11-21T05:14:30.510+00:00',
  eventDate: '2024-11-21T05:14:30.510+00:00',
};

describe('getVersionMetadata', () => {
  it('should return metadata from entity and updatedByUserId and updatedDate from version', () => {
    const entity = {
      metadata: {
        metadataKey: 'metadataValue',
        createdDate: '2024-11-21T01:55:55.066+00:00',
      },
    };

    expect(getVersionMetadata(version, entity)).toEqual({
      metadataKey: 'metadataValue',
      updatedByUserId: 'userId',
      updatedDate: 'actionDate',
    });
  });

  it('should return empty object if entity is not provided', () => {
    expect(getVersionMetadata(version)).toEqual({});
  });

  it('should return empty object if version is not provided', () => {
    const entity = {
      metadata: {
        metadataKey: 'metadataValue',
      },
    };

    expect(getVersionMetadata(null, entity)).toEqual({});
  });
});
