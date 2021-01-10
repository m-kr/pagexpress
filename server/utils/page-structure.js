const R = require('ramda');

/**
 * @param {object[]} componentPatterns
 * @param {object} component
 * @return {object}
 */
const prettifyComponentStructure = (componentPatterns, component) => {
  const { name, description } = componentPatterns.find(
    pattern => pattern._id.toString() === component.componentPatternId.toString()
  );

  return {
    ...component,
    name,
    description,
    componentPatternId: undefined,
  };
};

/**
 * @param {Object[]} components
 * @returns {Object[]}
 */
const getRootComponents = components => components.filter(component => !component.parentComponentId);

/**
 * @param {string} parentComponentId
 * @param {object[]} pageComponents
 * @return {object[]}
 */
const findNestedComponents = (parentComponentId, pageComponents) =>
  pageComponents.filter(component => component.parentComponentId === parentComponentId);

/**
 * @param {object[]} pageComponents
 * @param {object} parentComponent
 * @return {object}
 */
const fillNestedLevels = (pageComponents, parentComponent) => {
  const childrenComponents = findNestedComponents(parentComponent._id, pageComponents);

  if (!childrenComponents.length) {
    return parentComponent;
  }

  const processedParent = { ...parentComponent };

  for (const childComponent of childrenComponents) {
    if (!processedParent.components) {
      processedParent.components = [];
    }

    const processedChild = fillNestedLevels(pageComponents, childComponent);
    processedParent.components = [...processedParent.components, processedChild];
  }

  return processedParent;
};

/**
 * @param {object[]} pageComponents
 * @param {object[]} componentPatterns
 * returns {object[]}
 */
const buildPageStructure = (pageComponents, componentPatterns) => {
  const curriedPrettifyComponent = R.curry(prettifyComponentStructure)(componentPatterns);
  const enrichedComponents = R.map(curriedPrettifyComponent, pageComponents);
  const curriedFillNestedLevels = R.curry(fillNestedLevels)(enrichedComponents);
  const buildComponentsTree = rootComponents => R.map(curriedFillNestedLevels, rootComponents);

  return R.pipe(getRootComponents, buildComponentsTree)(enrichedComponents);
};

module.exports = {
  prettifyComponentStructure,
  getRootComponents,
  fillNestedLevels,
  findNestedComponents,
  buildPageStructure,
};
