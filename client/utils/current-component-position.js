export const currentComponentPosition = (components, targetComponentId) =>
  components.findIndex(component => component._id === targetComponentId);
