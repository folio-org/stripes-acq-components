/**
 * @class ResponseErrorContainer
 * @description A container class for handling individual errors from a response.
 * @param {Object} error - The error object containing details such as message, code, type, and parameters.
 */
export class ResponseErrorContainer {
  constructor(error = {}) {
    this.error = error;
  }

  get message() {
    return this.error.message;
  }

  get code() {
    return this.error.code;
  }

  get type() {
    return this.error.type;
  }

  get parameters() {
    return this.error.parameters;
  }

  /**
   * @description Convert the error parameters into a Map.
   * @returns {Map<string, Object>} A Map where the keys are parameter keys and the values are the parameter objects.
   */
  getParameters() {
    return new Map(this.error.parameters?.map((parameter) => [parameter.key, parameter]));
  }

  /**
   * @description Get a specific parameter value by its key.
   * @param {string} key - The key of the parameter to retrieve.
   * @returns {any} The value of the specified parameter, or undefined if not found.
   */
  getParameter(key) {
    return this.getParameters().get(key)?.value;
  }
}
