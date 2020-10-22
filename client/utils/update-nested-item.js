/**
 *
 * @param {array} items
 * @param {string} targetItemId
 * @param {string} nestedItemsKey
 * @param {function} callback
 * @return {array}
 */
export const updateNestedItem = (
  items,
  targetItemId,
  nestedItemsKey,
  callback
) => {
  for (const [index, item] of items.entries()) {
    if (item.id === targetItemId) {
      callback(item, index, items);

      break;
    }

    if (!item[nestedItemsKey]) {
      continue;
    }

    let targetItem;
    let targetItemIndex = null;
    const nestedEntries = item[nestedItemsKey].entries();

    for (const [nestedItem, nestedItemIndex] of nestedEntries) {
      if (nestedItem.id === targetItemId) {
        targetItem = nestedItem;
        targetItemIndex = nestedItemIndex;

        break;
      }
    }

    if (targetItem) {
      callback(targetItem, targetItemIndex, item[nestedItemsKey]);

      break;
    } else {
      updateNestedItem(
        item[nestedItemsKey],
        targetItemId,
        nestedItemsKey,
        callback
      );
    }
  }

  return items;
};
