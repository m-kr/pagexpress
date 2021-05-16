import { v4 as uuidv4 } from 'uuid';

/**
 * @param {object[]} components
 * @return {object[]} remapped components
 */
export const remapComponents = components => {
  const remapIds = new Map();

  return components
    .map(component => {
      const newId = uuidv4();
      remapIds.set(component._id, newId);

      return {
        ...component,
        _id: newId,
      };
    })
    .map(component => ({
      ...component,
      parentComponentId:
        remapIds.get(component.parentComponentId) ||
        component.parentComponentId,
    }));
};
