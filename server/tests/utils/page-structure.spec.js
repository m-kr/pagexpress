const pageData = require('../mock/page');
const {
  prettifyComponentStructure,
  fillAllNestedLevels,
  findNestedComponents,
  getRootComponents,
  buildPageStructure,
} = require('../../utils/page-structure');

describe('page-structure', () => {
  let components = null;
  beforeEach(() => {
    components = [...pageData.components];
  });

  describe('prettifyComponentStructure', () => {
    test('Should flatten component structure', () => {
      const sampleComponent = components[0];
      const { name, description } = sampleComponent.componentType;
      const flatComponent = prettifyComponentStructure(sampleComponent);

      expect(name).toEqual(flatComponent.name);
      expect(description).toEqual(flatComponent.description);
      expect(flatComponent.component).toBeUndefined();
    });
  });

  describe('getRootComponents', () => {
    test('Should return components without parentComponentId', () => {
      const existingComponentsWithParent = components.some((component) => !!component.parentComponentId);
      const rootComponents = getRootComponents(components);
      const rootComponentsWithParent = rootComponents.some((component) => !!component.parentComponentId);

      expect(existingComponentsWithParent).toBeTruthy();
      expect(rootComponentsWithParent).toBeFalsy();
    });
  });

  describe('findNestedComponents', () => {
    test('Should find 3 nested components', () => {
      const targetComponent = components.find((c) => c._id === '2');
      const foundNestedComponents = findNestedComponents(targetComponent._id, components);

      expect(foundNestedComponents).toHaveLength(2);
    });

    test('Should return empty array', () => {
      const targetComponent = components.find((c) => c._id === '1');
      const foundNestedComponents = findNestedComponents(targetComponent._id, components);

      expect(foundNestedComponents).toHaveLength(0);
    });
  });

  describe('fillAllNestedLevels', () => {
    test('Should enrich component with first children level', () => {
      const parentComponent = components.find((c) => c._id === '2');
      const enrichedComponent = fillAllNestedLevels(parentComponent, components);

      expect(enrichedComponent.components).toBeDefined();
      expect(enrichedComponent.components).toHaveLength(2);
    });

    test('Should enrich component with second children level', () => {
      const parentComponent = components.find((c) => c._id === '2');
      const enrichedComponent = fillAllNestedLevels(parentComponent, components);
      const nestedComponentWithChild = enrichedComponent.components.find((c) => c._id === '4');

      expect(nestedComponentWithChild.components).toBeDefined();
      expect(nestedComponentWithChild.components).toHaveLength(1);
    });
  });

  describe('buildPageStructure', () => {
    test('Should create nested structure from components list', () => {
      expect(components).toHaveLength(5);
      const structure = buildPageStructure(components);
      expect(structure).toHaveLength(2);
      expect(structure[1].components).toBeDefined();
      expect(structure[1].components).toHaveLength(2);
    });
  });
});
