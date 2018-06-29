/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */

/* local import */
import store from 'store';

fdescribe('== Module Store ==', () => {
  describe('trigger muttation:', () => {
    it('"setLoader" and set state loading to true', (done) => {
      store.commit('module/setLoader', true);
      // Get loading data from state
      const loadingModule = store.state.module.loading;

      // Expect loading data to be equal to true
      expect(loadingModule).toBeTruthy();

      done();
    });
    it('"setSecondaryLoader" and set state setSecondaryLoader to true', (done) => {
      store.commit('module/setSecondaryLoader', true);
      // Get loading data from state
      const secondaryLoadingModule = store.state.module.secondaryLoading;

      // Expect loading data to be equal to true
      expect(secondaryLoadingModule).toBeTruthy();

      done();
    });
    it('"setModuleData" with data, expect of the state "module" has been same to passed data', (done) => {
      const dataModule = {
        module: {},
        moduleId: 'edsr345',
        name: 'name',
      };

      store.commit('module/setModuleData', dataModule);

      const stateModule = store.state.module.module;
      expect(stateModule).toEqual(dataModule);

      done();
    });
    it('"setModuleFields", with data, expect of the state "module[status]" has setted to "draft"', (done) => {
      const dataStatus = { status: 'draft' };

      store.commit('module/setModuleFields', dataStatus);

      const stateModuleStatus = store.state.module.module.status;
      expect(stateModuleStatus).toEqual(dataStatus.status);
      
      done();
    });
    it('"setChangeSettingComponent" with data, expect of the state "changeSettingComponent" has been same to passed data', (done) => {
      const dataSetting = { 
        style: {
          paddingBottom: '0px',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '20px',
        },
        attribute: {
          bgColor: '#E02A2A',
        }, 
      };

      store.commit('module/setChangeSettingComponent', dataSetting);

      const stateModuleChangeSettingComponent = store.state.module.changeSettingComponent;
      expect(stateModuleChangeSettingComponent).toEqual(dataSetting);
      
      done();
    });
    it('"setCurrentComponent" with data, expect of the state "currentComponent" has been same to passed data', (done) => {
      const dataSetting = {
        columnId: 0,
        componentId: 0,
      };

      store.commit('module/setCurrentComponent', dataSetting);

      const stateModuleSetCurrentComponent = store.state.module.currentComponent;
      expect(stateModuleSetCurrentComponent).toEqual(dataSetting);

      done();
    });
  });
});
