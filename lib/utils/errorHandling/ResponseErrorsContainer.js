import { ERROR_CODE_GENERIC } from '../../constants';
import { ResponseErrorContainer } from './ResponseErrorContainer';

const ERROR_MESSAGE_GENERIC = 'An unknown error occurred';

/**
 * @class
 * @description Container for response errors
 * @param {Object} responseBody - Response body
 * @param {Response} response - Response
 */
export class ResponseErrorsContainer {
  /* private */ constructor(responseBody, response) {
    this.originalResponseBody = responseBody;
    this.originalResponse = response;

    // Initialize the map of errors
    this.errorsMap = new Map(
      responseBody.errors?.reduce((acc, error) => {
        const errorContainer = this.getStructuredError(error);

        acc.push([errorContainer.code || ERROR_CODE_GENERIC, errorContainer]);

        return acc;
      }, []),
    );

    this.totalRecords = responseBody.total_records;
  }

  /**
   * @static
   * @description Create a new instance of ResponseErrorsContainer.
   * @param {Response} response - The Response object from which to create the error handler.
   * @returns {Promise<{handler: ResponseErrorsContainer}>} A promise that resolves to an object containing the error handler.
   */
  static async create(response) {
    try {
      const responseBody = await response.clone().json();

      return {
        handler: (
          responseBody?.errors
            ? new ResponseErrorsContainer(responseBody, response)
            : new ResponseErrorsContainer({ errors: [responseBody], total_records: 1 }, response)
        ),
      };
    } catch (error) {
      return {
        handler: new ResponseErrorsContainer({ errors: [error], total_records: 1 }, response),
      };
    }
  }

  /**
   * @description Handle the errors using a given strategy.
   * @param {Object} strategy - The error handling strategy to be applied.
   */
  handle(strategy) {
    return strategy.handle(this);
  }

  get status() {
    return this.originalResponse?.status;
  }

  /**
   * @description Get an array of error messages.
   * @returns {Array<string | undefined>} An array of error messages.
   */
  get errorMessages() {
    return this.errors.map((error) => error.message);
  }

  /**
   * @description Get an array of error codes.
   * @returns {Array<string | undefined>} An array of error codes.
   */
  get errorCodes() {
    return this.errors.map((error) => error.code);
  }

  /**
   * @description Get all errors as an array.
   * @returns {Array<ResponseErrorContainer>} An array of error containers.
   */
  get errors() {
    return Array.from(this.errorsMap.values());
  }

  /**
   * @description Get all errors as a map.
   * @returns {Map<string, ResponseErrorContainer>} A map of errors with error codes as keys.
   */
  getErrors() {
    return this.errorsMap;
  }

  /**
   * @description Get a specific error by its code or the first error if no code is provided.
   * @param {string} [code] - The error code to search for.
   * @returns {ResponseErrorContainer} The corresponding error container or a generic error if not found.
   */
  getError(code) {
    return (code ? this.errorsMap.get(code) : this.errors[0]) || new ResponseErrorContainer();
  }

  /**
   * @private
   * @description Normalize an unknown error into a structured ResponseErrorContainer.
   * @param {unknown} error - The unstructured error object.
   * @returns {ResponseErrorContainer} A structured error container.
   */
  getStructuredError(error) {
    let normalizedError;

    if (typeof error === 'string') {
      try {
        const parsed = JSON.parse(error);

        normalizedError = {
          message: parsed.message || error,
          code: parsed.code || ERROR_CODE_GENERIC,
          ...parsed,
        };
      } catch {
        normalizedError = {
          message: error,
          code: ERROR_CODE_GENERIC,
        };
      }
    } else {
      let message;

      try {
        message = error?.message || error?.error || JSON.stringify(error);
      } catch {
        message = ERROR_MESSAGE_GENERIC;
      }
      normalizedError = {
        code: error?.code || ERROR_CODE_GENERIC,
        message,
        ...error,
      };
    }

    return new ResponseErrorContainer(normalizedError);
  }
}
