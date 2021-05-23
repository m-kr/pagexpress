import { getAllDescendants } from '../../utils';

const components = [
  {
    _id: '1',
  },
  {
    _id: '2',
    parentComponentId: '1',
  },
  {
    _id: '3',
  },
  {
    _id: '4',
    parentComponentId: '2',
  },
  {
    _id: '5',
    parentComponentId: '4',
  },
];

describe('getAllDescendants', () => {
  test('should return all descendants', () => {
    const descendants = getAllDescendants('1', components);

    expect(descendants).toHaveLength(4);
    expect(descendants.find(d => d._id === '3')).toBeUndefined();
  });
});
