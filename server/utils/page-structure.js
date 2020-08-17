const R = require('ramda');

const prettifyComponentStructure = (componentPatterns, component) => {
  const { name, description } = componentPatterns.find(pattern =>
    pattern._id.toString() === component.componentPatternId.toString());

  return {
    ...component,
    name,
    description,
    componentPatternId: undefined,
  };
};

/**
 *
 * @param {Object[]} components
 * @returns {Object[]}
 */
const getRootComponents = components => components.filter(component => !component.parentComponentId);

const findNestedComponents = (parentComponentId, pageComponents) =>
  pageComponents.filter(component => component.parentComponentId === parentComponentId);

const fillNestedLevels = (pageComponents, parentComponent) => {
  const childrenComponents = findNestedComponents(parentComponent._id, pageComponents);

  if (!childrenComponents.length) {
    return parentComponent;
  }

  for (const childComponent of childrenComponents) {
    if (!parentComponent.components) {
      parentComponent.components = [];
    }

    const grandChildrenComponents = findNestedComponents(childComponent._id, pageComponents);
    const processedChild = grandChildrenComponents.length
      ? fillNestedLevels(grandChildrenComponents, childComponent)
      : childComponent;

    parentComponent.components = [...parentComponent.components, processedChild];
  }

  return parentComponent;
};

/**
 *
 * @param {Object[]} pageComponents
 * @param {Object[]} componentPatterns
 * returns {Object[]}
 */
const buildPageStructure = (pageComponents, componentPatterns) => {
  const curriedPrettifyComponent = R.curry(prettifyComponentStructure)(componentPatterns);
  const enrichedComponents = pageComponents.map(curriedPrettifyComponent);
  const curriedFillNestedLevels = R.curry(fillNestedLevels)(enrichedComponents);
  const buildComponentsTree = rootComponents => R.map(curriedFillNestedLevels, rootComponents);

  console.log(enrichedComponents);
  console.log(getRootComponents(pageComponents));

  return R.pipe(
    getRootComponents,
    buildComponentsTree,
  )(enrichedComponents);
};

module.exports = {
  prettifyComponentStructure,
  getRootComponents,
  fillNestedLevels,
  findNestedComponents,
  buildPageStructure,
};
