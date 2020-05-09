import { shallowMount } from '@vue/test-utils';
import Table from '@/components/Table.vue';

const sampleTableData = {
  '123': ['First page', '/sample-url'],
  '234': ['Second page', '/sample-second-url'],
};

const headers = ['Title', 'URL'];
const buttonData = {
  type: 'button',
  styleClass: 'danger',
  label: 'Delete',
};

describe('Table', () => {
  let wrapper, deleteAction;

  beforeEach(() => {
    deleteAction = jest.fn();
    wrapper = shallowMount(Table, {
      propsData: {
        data: sampleTableData,
        headers,
        actions: {
          delete: {
            ...buttonData,
            action: deleteAction,
          },
        },
      },
    });
  });

  test('should display 2 rows with proper data inside', () => {
    const rows = wrapper.findAll('tbody tr');
    const cells = wrapper.findAll('tbody td');

    expect(rows).toHaveLength(2);
    expect(cells.at(0).text()).toBe(sampleTableData['123'][0]);
    expect(cells.at(1).text()).toBe(sampleTableData['123'][1]);
  });

  test('should display proper headers', () => {
    const headerCells = wrapper.findAll('th');

    expect(headerCells.at(0).text()).toBe(headers[0]);
    expect(headerCells.at(1).text()).toBe(headers[1]);
  });

  test('should call action callback with record id', () => {
    const button = wrapper.find('button');

    expect(button.text()).toBe(buttonData.label);
    expect(button.classes()).toContain(`is-${buttonData.styleClass}`);

    button.trigger('click');
    expect(deleteAction).toHaveBeenCalledWith(Object.keys(sampleTableData)[0]);
  });
});
