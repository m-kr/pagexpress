import { shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import Notification from '@/components/Notification.vue';

xdescribe('Notification', () => {
  test('should display message', async () => {
    const wrapper = shallowMount(Notification);

    const notificationContainer = wrapper.find('.notification');
    const sampleMessage = 'Big error';
    wrapper.setProps({ message: sampleMessage });
    await Vue.nextTick();

    expect(notificationContainer.text()).toBe(sampleMessage);
  });
});
