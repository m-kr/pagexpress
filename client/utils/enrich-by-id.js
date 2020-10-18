import { v4 as uuidv4 } from 'uuid';

export const enrichById = (items, nestedItemsKey) => {
  return items.map(item => {
    item.id = uuidv4();

    if (nestedItemsKey && item[nestedItemsKey]) {
      item[nestedItemsKey] = enrichById(item[nestedItemsKey], nestedItemsKey);
    }

    return item;
  });
};
