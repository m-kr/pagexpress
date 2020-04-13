const pageData = require('../mock/page');
const {
  fillAllNestedLevels,
  findNestedComponents,
} = require('../../utils/page-structure');

const { components } = pageData;

describe('page-structure', () => {
  describe('findNestedComponents', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test('Should find 3 nested components', () => {
      const targetComponent = components.find(c => c._id === '2');
      const foundNestedComponents = findNestedComponents(targetComponent._id, components);

      expect(foundNestedComponents).toHaveLength(3);
    });

    test('Should return empty array', () => {
      const targetComponent = components.find(c => c._id === '1');
      const foundNestedComponents = findNestedComponents(targetComponent._id, components);

      expect(foundNestedComponents).toHaveLength(0);
    });
  });

  describe('fillAllNestedLevels', () => {
    test('Should enrich component with first children level', () => {
      const parentComponent = components.find(c => c._id === '2');
      const enrichedComponent = fillAllNestedLevels(parentComponent, components);

      expect(enrichedComponent.components).toBeDefined();
      expect(enrichedComponent.components).toHaveLength(2);
    });

    test('Should enrich component with second children level', () => {
      const parentComponent = components.find(c => c._id === '2');
      const enrichedComponent = fillAllNestedLevels(parentComponent, components);
      const nestedComponentWithChild = enrichedComponent.components.find(c => c._id === '4');

      expect(nestedComponentWithChild.components).toBeDefined();
      expect(nestedComponentWithChild.components).toHaveLength(1);
    });
  });
});
