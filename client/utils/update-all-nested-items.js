/**
 *
 * @param {array} items
 * @param {string} nestedItemsKey
 * @param {function} callback
 * @return {array}
 */
export const updateAllNestedItems = (items, nestedItemsKey, callback) => {
  for (const item of items) {
    callback(item);

    if (item[nestedItemsKey] && item[nestedItemsKey].length) {
      item[nestedItemsKey] = updateAllNestedItems(
        item[nestedItemsKey],
        nestedItemsKey,
        callback
      );
    }
  }

  return items;
};
