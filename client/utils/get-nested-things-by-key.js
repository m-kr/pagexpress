export const getNestedThingsByKey = (items, key) => {
  let foundThings = [...items];

  foundThings.forEach(thing => {
    if (thing[key]) {
      foundThings = [...foundThings, ...getNestedThingsByKey(thing[key], key)];
    }
  });

  return foundThings;
};
