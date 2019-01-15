/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint max-len: 0 */
/* global Application */

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex/dist/vuex';
import { cloneDeep } from 'lodash';
import 'expect-more-jest';
/* local import */
import globalStore from '@/store/globalStore';

const localVue = createLocalVue();

localVue.use(Vuex);

function createStore(option) {
  return new Vuex.Store(option);
}

describe('== Global Store ==', () => {
  let store = () => {};
  beforeEach(() => {
    store = createStore({
      strict: true,
      modules: {
        global: cloneDeep(globalStore),
      },
    });
  });
  afterEach(() => {
    store = null;
  });
  describe('trigger mutation:', () => {
    it('"setLoader" and expect set "loading" state to true', (done) => {
      store.commit('global/setLoader', true);
      let loadingState = store.state.global.loading;
      expect(loadingState).toBeTruthy();
      loadingState = null;
      done();
    });
    it('"setSecondaryLoader" and expect set "secondaryLoading" state to true', (done) => {
      store.commit('global/setSecondaryLoader', true);
      let loadingState = store.state.global.secondaryLoading;
      expect(loadingState).toBeTruthy();
      loadingState = null;
      done();
    });
  });
});
