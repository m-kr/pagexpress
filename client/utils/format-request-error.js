export const formatRequestError = error =>
  `Error code ${error.response.status}: ${error.response.data.message}`;
