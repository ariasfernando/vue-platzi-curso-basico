import Vue from 'vue';
import chai from 'chai';
import acl from '../../resources/assets/vue/resources/plugins/acl';

const expect = chai.expect;

Vue.use(acl);

Vue.prototype.$_app = {
  config: {
    permissions: ['create_campaign'],
  },
};

describe('Can', () => {
  it('Should return true for a valid permission', (done) => {
    const can = Vue.prototype.$can('create_campaign');
    expect(can).to.be.true;
    done();
  });

  it('Should return false for an invalid permission', (done) => {
    const can = Vue.prototype.$can('edit_campaign');
    expect(can).to.be.false;
    done();
  });

  it('Should return false for empty permission', (done) => {
    const can = Vue.prototype.$can();
    expect(can).to.be.false;
    done();
  });
});
