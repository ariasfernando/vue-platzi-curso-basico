/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint import/no-extraneous-dependencies:0 */
/* eslint max-len: 0 */
/* eslint no-console: 0 */
/* global Application */


/* vendor import */
import 'expect-more-jest';
import { cloneDeep } from 'lodash';
import { createLocalVue } from '@vue/test-utils';
import nock from 'nock';
import Vue from 'vue';
import Vuex from 'vuex';
/* local import */
// import Element from '@/models/Element';
import imageService from '@/services/image';
import moduleService from '@/services/module';
import moduleStore from '@/store/moduleStore';
import mocks from '../../../mocks';

const localVue = createLocalVue();

localVue.use(Vuex);

function createStore(option) {
  return new Vuex.Store(option);
}

const getRows = (module => module.module.structure.rows);

module.exports = {
  cloneDeep,
  nock,
  Vue,
  // Element,
  imageService,
  mocks,
  moduleService,
  moduleStore,
  getRows,
  localVue,
  createStore,
};
