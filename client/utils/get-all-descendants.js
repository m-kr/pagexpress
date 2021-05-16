export const getAllDescendants = (
  rootComponentId,
  components,
  accumulator = []
) => {
  const rootComponent = components.find(
    component => component._id === rootComponentId
  );
  const restComponents = components.filter(
    component => component._id !== rootComponentId
  );

  for (const component of restComponents) {
    if (rootComponent._id === component.parentComponentId) {
      accumulator = [
        ...accumulator,
        ...getAllDescendants(component._id, restComponents, accumulator),
      ];
    }
  }

  return [rootComponentId, ...accumulator];
};
