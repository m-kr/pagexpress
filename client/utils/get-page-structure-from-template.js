import { v4 as uuidv4 } from 'uuid';

export const getComponentData = (component, parentComponentId) => {
  const componentData = {
    _id: uuidv4(),
    componentPatternId: component.componentPatternId,
  };

  if (parentComponentId) {
    componentData.parentComponentId = parentComponentId;
  }

  return componentData;
};

export const getPageStructureFromTemplate = templateComponents => {
  if (!templateComponents) {
    return;
  }

  let components = [];

  for (const templateComponent of templateComponents) {
    const componentData = getComponentData(templateComponent);
    components.push(componentData);

    if (templateComponent.childrenComponentPatterns) {
      components = [
        ...components,
        ...templateComponent.childrenComponentPatterns.map(componentPatternId =>
          getComponentData({ componentPatternId }, componentData._id)
        ),
      ];
    }
  }

  return components;
};
