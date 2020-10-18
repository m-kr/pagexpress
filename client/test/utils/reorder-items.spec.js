import { reorderItems } from '@/utils';

const MENU_ITEMS_SAMPLE = [
  { label: 'Home', url: '/', id: '17d275c5-6b1d-43d7-af11-512a2deb89fa' },
  {
    label: 'Photography',
    url: '/photo',
    children: [
      {
        label: 'Landscapes',
        url: '/photo/landscapes',
        children: [
          {
            label: 'Night landscapes',
            url: '/photo/landscapes/night',
            id: '0b8a395d-e34b-410d-9f6c-7eab5eeb052d',
          },
        ],
        id: 'fb5ffb26-6681-49d6-9695-f817e3f31691',
      },
    ],
    id: 'e64ceb6b-080e-4b43-8efd-46236c88c293',
  },
];

describe('reorderItems', () => {
  let menuItems = [];

  beforeEach(() => {
    menuItems = [...MENU_ITEMS_SAMPLE];
  });

  test('should remove item', () => {
    const dragResult = { addedIndex: null, removedIndex: 0, payload: null };
    const firstElement = menuItems[0];
    const menuItemsLength = menuItems.length;
    const reorderedItems = reorderItems(menuItems, dragResult);

    expect(reorderedItems).toHaveLength(menuItemsLength - 1);
    expect(reorderedItems[dragResult.removedIndex].id).not.toEqual(
      firstElement.id
    );
  });

  test('should add item at second position', () => {
    const newItem = {
      id: '123',
      label: 'Page',
      url: '/page',
    };
    const dragResult = { addedIndex: 1, removedIndex: null, payload: newItem };
    const menuItemsLength = menuItems.length;
    const reorderedItems = reorderItems(menuItems, dragResult);

    expect(reorderedItems).toHaveLength(menuItemsLength + 1);
    expect(reorderedItems[dragResult.addedIndex].id).toEqual(newItem.id);
  });

  test('should reorder items', () => {
    const dragResult = { addedIndex: 1, removedIndex: 0, payload: null };
    const reorderedItems = reorderItems(menuItems, dragResult);

    expect(reorderedItems[dragResult.addedIndex].id).toEqual(
      menuItems[dragResult.removedIndex].id
    );
    expect(reorderedItems[dragResult.removedIndex].id).toEqual(
      menuItems[dragResult.addedIndex].id
    );
  });

  test('should do nothing with items', () => {
    const dragResult = { addedIndex: null, removedIndex: null, payload: null };
    const reorderedItems = reorderItems(menuItems, dragResult);

    expect(reorderedItems).toEqual(menuItems);
  });

  test('should return undefined value when result reorder array is empty', () => {
    const oneItemMenu = [menuItems[0]];
    const dragResult = { addedIndex: null, removedIndex: 0, payload: null };
    const reorderedItems = reorderItems(oneItemMenu, dragResult);

    expect(reorderedItems).toBeUndefined();
  });
});
