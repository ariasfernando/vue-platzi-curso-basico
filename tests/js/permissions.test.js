/* eslint-env node, jest, es6 */
import Vue from 'vue';
import acl from '../../resources/assets/vue/resources/plugins/acl';

Vue.use(acl);

Vue.prototype.$_app = {
  config: {
    permissions: ['create_campaign'],
  },
};

describe('Can', () => {
  it('Should return true for a valid permission', (done) => {
    let can = Vue.prototype.$can('create_campaign');
    expect(can).toBeTruthy();
    can = null;
    done();
  });

  it('Should return false for an invalid permission', (done) => {
    let can = Vue.prototype.$can('edit_campaign');
    expect(can).toBeFalsy();
    can = null;
    done();
  });

  it('Should return false for empty permission', (done) => {
    let can = Vue.prototype.$can();
    expect(can).toBeFalsy();
    can = null;
    done();
  });
});
