import Vue from 'vue';
import Vuex from 'vuex';
import { shallow } from 'vue-test-utils';
import Toast from 'vue-easy-toast';

import Campaign from '../../../../resources/assets/vue/components/campaign/Campaign.vue';
import store from '../../../../resources/assets/vue/store';
Vue.use(Vuex);

Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
  closeable: true,
});

describe('Campaign', () => {
  it('works', () => {
    const wrapper = shallow(Campaign, {
      store,
      propsData: {
        campaignId: '5aec6f6c06c050000e22d0f3',
        libraryId: '5ae9d5729db2d5000d0fd6e2',
        windowId: '890cbafc24091ca26127f1ab9674e2',
        cachedWindowId: undefined,
      },
      stubs: {
        EmailActions: '<email-actions />',
      },
    });

    const todos = wrapper.findAll('EmailActions');

    expect(todos.length).toBe(1);

  });
});
