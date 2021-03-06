import { ERROR_CODE_GENERIC } from '../constants';

export const getErrorCodeFromResponse = async (errorResponse) => {
  let errorCode = null;

  try {
    const responseJson = await errorResponse.json();

    errorCode = responseJson?.errors?.[0]?.code || ERROR_CODE_GENERIC;
  } catch (parsingException) {
    errorCode = ERROR_CODE_GENERIC;
  }

  return errorCode;
};
