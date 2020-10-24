import { formatRequestError } from '@/utils/format-request-error';

/**
 *
 * @param request
 * @param dispatch
 * @return {Promise<*>}
 */
export const getRequestData = async ({ request, dispatch }) => {
  try {
    const response = await request.catch(error =>
      dispatch('notifications/error', formatRequestError(error), {
        root: true,
      })
    );

    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    dispatch('notifications/error', error, { root: true });
  }
};
