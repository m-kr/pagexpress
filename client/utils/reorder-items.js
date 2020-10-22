/**
 *
 * @param items
 * @param removedIndex
 * @param addedIndex
 * @param payload
 * @returns {*[]|undefined}
 */
export const reorderItems = (items, { removedIndex, addedIndex, payload }) => {
  if (removedIndex === null && addedIndex === null) return items;

  const reorderedItems = [...items];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = reorderedItems.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    reorderedItems.splice(addedIndex, 0, itemToAdd);
  }

  return reorderedItems.length ? reorderedItems : undefined;
};
