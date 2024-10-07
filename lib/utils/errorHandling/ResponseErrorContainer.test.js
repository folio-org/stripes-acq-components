/* Developed collaboratively using AI (GitHub Copilot) */

import { ERROR_CODE_GENERIC } from '../../constants';
import { ResponseErrorContainer } from './ResponseErrorContainer';

describe('ResponseErrorContainer', () => {
  it('should return message, code, and type from error', () => {
    const errorData = {
      message: 'Test error message',
      code: 'testCode',
      type: 'testType',
    };
    const errorContainer = new ResponseErrorContainer(errorData);

    expect(errorContainer.message).toBe('Test error message');
    expect(errorContainer.code).toBe('testCode');
    expect(errorContainer.type).toBe('testType');
  });

  it('should return undefined if no message or type is provided, and the generic code', () => {
    const errorContainer = new ResponseErrorContainer();

    expect(errorContainer.message).toBeUndefined();
    expect(errorContainer.code).toBe(ERROR_CODE_GENERIC);
    expect(errorContainer.type).toBeUndefined();
  });

  it('should return parameters map if parameters are provided', () => {
    const errorData = {
      parameters: [
        { key: 'param1', value: 'value1' },
        { key: 'param2', value: 'value2' },
      ],
    };
    const errorContainer = new ResponseErrorContainer(errorData);

    const parametersMap = errorContainer.getParameters();

    expect(parametersMap.size).toBe(2);
    expect(parametersMap.get('param1').value).toBe('value1');
    expect(parametersMap.get('param2').value).toBe('value2');
  });

  it('should return an empty map if no parameters are provided', () => {
    const errorContainer = new ResponseErrorContainer();

    const parametersMap = errorContainer.getParameters();

    expect(parametersMap.size).toBe(0);
  });

  it('should return parameter value for a given key', () => {
    const errorData = {
      parameters: [{ key: 'param1', value: 'value1' }],
    };
    const errorContainer = new ResponseErrorContainer(errorData);

    expect(errorContainer.getParameter('param1')).toBe('value1');
  });

  it('should return undefined if parameter key is not found', () => {
    const errorContainer = new ResponseErrorContainer();

    expect(errorContainer.getParameter('nonexistentKey')).toBeUndefined();
  });
});
