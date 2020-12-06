import { formatRequestError } from '@/utils/format-request-error';

/**
 *
 * @param {Promise,<*>} request
 * @param {CallableFunction} dispatch
 * @param {string} [successMessage] Message on request success
 * @return {Promise<*>}
 */
export const showRequestResult = async ({
  request,
  dispatch,
  successMessage,
}) => {
  try {
    const response = await request;

    if (!(response && response.data)) {
      throw new Error({
        status: 'error',
        message: 'Empty request result',
      });
    }

    if (successMessage) {
      dispatch('notifications/success', successMessage, { root: true });
    }

    return response.data;
  } catch (error) {
    dispatch('notifications/error', formatRequestError(error), {
      root: true,
    });
  }
};
