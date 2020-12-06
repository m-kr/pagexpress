export const formatRequestError = error =>
  `${error.response.data.message} (code ${error.response.status})`;
