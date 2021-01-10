const pageDetails = require('../mock/page-details.json');
const componentsPatterns = require('../mock/component-patterns.json');

const {
  prettifyComponentStructure,
  fillNestedLevels,
  findNestedComponents,
  getRootComponents,
  buildPageStructure,
} = require('../../utils/page-structure');

describe('page-structure', () => {
  let components = null;
  beforeEach(() => {
    components = [...pageDetails.components];
  });

  describe('prettifyComponentStructure', () => {
    test('Should flatten component structure', () => {
      const sampleComponent = pageDetails.components[0];
      const { name, description } = componentsPatterns[0];
      const flatComponent = prettifyComponentStructure(componentsPatterns, sampleComponent);

      expect(name).toEqual(flatComponent.name);
      expect(description).toEqual(flatComponent.description);
      expect(flatComponent.component).toBeUndefined();
    });
  });

  describe('getRootComponents', () => {
    test('Should return components without parentComponentId', () => {
      const existingComponentsWithParent = components.some(component => !!component.parentComponentId);
      const rootComponents = getRootComponents(components);
      const rootComponentsWithParent = rootComponents.some(component => !!component.parentComponentId);

      expect(existingComponentsWithParent).toBeTruthy();
      expect(rootComponentsWithParent).toBeFalsy();
    });
  });

  describe('findNestedComponents', () => {
    test('Should find 1 nested component', () => {
      const targetComponent = components.find(c => c._id === '2');
      const foundNestedComponents = findNestedComponents(targetComponent._id, components);

      expect(foundNestedComponents).toHaveLength(1);
    });

    test('Should return empty array', () => {
      const targetComponent = components[components.length - 1];
      const foundNestedComponents = findNestedComponents(targetComponent._id, components);

      expect(foundNestedComponents).toHaveLength(0);
    });
  });

  describe('fillNestedLevels', () => {
    test('Should enrich component with first children level', () => {
      const parentComponent = components[0];
      const enrichedComponent = fillNestedLevels([...components], { ...parentComponent });

      expect(enrichedComponent.components).toBeDefined();
      expect(enrichedComponent.components).toHaveLength(1);
    });

    test('Should enrich component with second children level', () => {
      const parentComponent = components[0];
      const enrichedComponent = fillNestedLevels(components, parentComponent);
      const nestedComponentWithChild = enrichedComponent.components[0];

      expect(enrichedComponent.components).toHaveLength(1);
      expect(nestedComponentWithChild.components).toHaveLength(1);
    });

    test('Should enrich component with third children level', () => {
      const parentComponent = components[0];
      const enrichedComponent = fillNestedLevels(components, parentComponent);
      const firstNestedComponentWithChild = enrichedComponent.components[0];
      const secondNestedComponentWithChild = firstNestedComponentWithChild.components[0];

      expect(enrichedComponent.components).toHaveLength(1);
      expect(firstNestedComponentWithChild.components).toHaveLength(1);
      expect(secondNestedComponentWithChild.components).toHaveLength(1);
    });
  });

  describe('buildPageStructure', () => {
    test('Should create nested structure from components list', () => {
      expect(components).toHaveLength(4);
      const structure = buildPageStructure(components, componentsPatterns);
      expect(structure).toHaveLength(1);
      expect(structure[0].components).toHaveLength(1);
    });
  });
});
