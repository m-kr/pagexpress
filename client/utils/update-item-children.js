/**
 *
 * @param items
 * @param parentItemId
 * @param callback
 * @returns {array}
 */
export const updateItemChildren = (items, parentItemId, callback) => {
  return items.map(item => {
    let updatedItem = { ...item };

    if (item.id === parentItemId && item.children) {
      updatedItem = {
        ...item,
        children: callback(item.children),
      };
    }

    if (item.id !== parentItemId && item.children) {
      updatedItem = {
        ...item,
        children: updateItemChildren(item.children, parentItemId, callback),
      };
    }

    return updatedItem;
  });
};
