import { remapComponents } from '@/utils';

const components = [
  {
    _id: '1',
    parentComponentId: '99',
    name: 'sample-1',
  },
  {
    _id: '2',
    parentComponentId: '1',
    name: 'sample-2',
  },
  {
    _id: '3',
    name: 'sample-3',
  },
  {
    _id: '4',
    parentComponentId: '2',
    name: 'sample-4',
  },
  {
    _id: '5',
    parentComponentId: '4',
    name: 'sample-5',
  },
];

describe('remapComponents', () => {
  test('should change components ids', () => {
    remapComponents(components).forEach((remappedComponent, index) =>
      expect(remappedComponent._id).not.toEqual(components[index]._id)
    );
  });

  test('should set proper connection between components', () => {
    const remappedComponents = remapComponents(components);
    const secondComponent = remappedComponents.find(c => c.name === 'sample-2');
    const fourthComponent = remappedComponents.find(c => c.name === 'sample-4');
    const fifthComponent = remappedComponents.find(c => c.name === 'sample-5');

    expect(fourthComponent.parentComponentId).toEqual(secondComponent._id);
    expect(fifthComponent.parentComponentId).toEqual(fourthComponent._id);
  });

  test('should leave parentComponentId with connected with other node', () => {
    const remappedComponents = remapComponents(components);
    const firstComponent = remappedComponents.find(c => c.name === 'sample-1');

    expect(firstComponent.parentComponentId).toEqual(
      components[0].parentComponentId
    );
  });
});
