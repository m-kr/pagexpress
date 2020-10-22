import { v4 as uuidv4 } from 'uuid';

/**
 *
 * @param {array|object} target
 * @param {string} [nestedItemsKey]
 * @returns {{id: string}|*}
 */
export const enrichById = (target, nestedItemsKey) => {
  if (!Array.isArray(target)) {
    return {
      ...target,
      id: uuidv4(),
    };
  }

  return target.map(item => {
    item.id = uuidv4();

    if (nestedItemsKey && item[nestedItemsKey]) {
      item[nestedItemsKey] = enrichById(item[nestedItemsKey], nestedItemsKey);
    }

    return item;
  });
};
