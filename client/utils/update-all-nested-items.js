/**
 *
 * @param {array} items
 * @param {string} nestedItemsKey
 * @param {function} callback
 * @return {array}
 */
export const updateAllNestedItems = (items, nestedItemsKey, callback) => {
  return items.map(item => ({
    ...callback(item),
    [nestedItemsKey]:
      item[nestedItemsKey] && item[nestedItemsKey].length
        ? updateAllNestedItems(item[nestedItemsKey], nestedItemsKey, callback)
        : undefined,
  }));
};
