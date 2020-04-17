const prettifyComponentStructure = (component) => {
  if (!component.componentType) {
    return component;
  }

  const { name, description } = component.componentType;

  return {
    ...component,
    name,
    description,
    componentType: undefined,
  };
};

/**
 *
 * @param {Object[]} components
 * @returns {Object[]}
 */
const getRootComponents = (components) => components.filter((component) => !!component.parentComponentId === false);

const findNestedComponents = (parentComponentId, pageComponents) =>
  pageComponents
    .filter((component) => component.parentComponentId === parentComponentId)
    .sort((a, b) => parseInt(a.order) - parseInt(b.order));

const fillAllNestedLevels = (parentComponent, pageComponents) => {
  const childrenComponents = findNestedComponents(parentComponent._id, pageComponents);
  let enrichedComponent = prettifyComponentStructure(parentComponent);

  if (!childrenComponents.length) {
    return enrichedComponent;
  }

  for (const childComponent of childrenComponents) {
    if (!enrichedComponent.components) {
      enrichedComponent.components = [];
    }

    const enrichedChildComponent = prettifyComponentStructure(childComponent);
    const grandChildrenComponents = findNestedComponents(enrichedChildComponent._id, pageComponents);
    const processedChild = grandChildrenComponents.length
      ? fillAllNestedLevels(enrichedChildComponent, grandChildrenComponents)
      : enrichedChildComponent;

    enrichedComponent.components = [...enrichedComponent.components, processedChild];
  }

  return enrichedComponent;
};

/**
 *
 * @param {Object[]} pageComponents
 * returns {Object}
 */
const buildPageStructure = (pageComponents) => {
  const rootComponents = getRootComponents(pageComponents);
  return rootComponents.map((rootComponent) => fillAllNestedLevels(rootComponent, pageComponents));
};

module.exports = {
  prettifyComponentStructure,
  getRootComponents,
  fillAllNestedLevels,
  findNestedComponents,
  buildPageStructure,
};
