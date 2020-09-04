/**
 *
 * @param {Date} dateObject
 * @returns {string}
 */
export const formatDate = dateObject =>
  dateObject
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .split(' ')
    .join('-');
