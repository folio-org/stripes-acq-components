import { batchFetch } from './batchFetch';

describe('batchFetch util fn', () => {
  let mutatorFn;

  beforeEach(() => {
    mutatorFn = {
      GET: jest.fn(),
      reset: jest.fn(),
    };
  });

  it('should not call API if no query item passed', () => {
    batchFetch(mutatorFn, []);
    batchFetch(mutatorFn, null);
    batchFetch(mutatorFn, undefined);

    expect(mutatorFn.GET).not.toHaveBeenCalled();
  });

  it('should call API if some ids passed', () => {
    batchFetch(mutatorFn, ['id1']);

    expect(mutatorFn.GET).toHaveBeenCalled();
  });

  it('should call API if some query objects and queryBuilder function are passed', () => {
    batchFetch(mutatorFn, [{ id: 'id1' }], (itemsChunk) => {
      const query = itemsChunk
        .map(({ id }) => `relationId==${id}`)
        .join(' or ');

      return query || '';
    });

    expect(mutatorFn.GET).toHaveBeenCalled();
  });

  it('should call API if some ids and query params are passed', () => {
    batchFetch(mutatorFn, ['id1'], undefined, { customParam: 'hey' });

    expect(mutatorFn.GET).toHaveBeenCalled();
  });
});
