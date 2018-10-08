/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint no-console: 0 */
/* eslint max-len: 0 */
/* global Application */

/* vendor import */
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex/dist/vuex';
import { cloneDeep } from 'lodash';
import nock from 'nock';
import 'expect-more-jest';
/* local import */
// import libraryStore from '@/store/libraryStore';
// import moduleStore from '@/store/moduleStore';
import campaignService from '@/services/campaign';
import imageService from '@/services/image';
import realStore from '@/store';
import campaignStore from '@/store/campaignStore';
import mocks from '@/resources/mocks';

const localVue = createLocalVue();

localVue.use(Vuex);

function createStore(option) {
  return new Vuex.Store(option);
}

/*
 * == Test: Models
 */
describe('== Campaign Store ==', () => {
  let original = () => {};
  let store = () => {};
  beforeAll(() => {
    original = console.error;
  });
  beforeEach(() => {
    console.error = jest.fn();
    store = createStore({
      strict: true,
      modules: {
        campaign: cloneDeep(campaignStore),
      },
    });
  });
  afterEach(() => {
    console.error.mockClear();
    console.error = original;
    store = null;
  });
  afterAll(() => {
    original = null;
  });
  describe('trigger muttation:', () => {
    it('"campaignValidated" and expect of set "campaignValidated" state to true', (done) => {
      let status = true;

      store.commit('campaign/campaignValidated', status);

      let stateCampaignValidated = store.state.campaign.campaignValidated;

      expect(stateCampaignValidated).toBeTruthy();

      status = null;
      stateCampaignValidated = null;

      done();
    });
    it('"campaignCanBeProcessed" and expect of set "campaign.campaign_data.can_be_processed" state to true', (done) => {
      let status = true;
      let newStruct = {
        campaign_name: 'Untitled Email',
        locale: 'en_us',
        campaign_id: '5b64b80f02a4cd00160fade2',
        campaign_data: {
          _id: '5b64b80f02a4cd00160fade2',
          campaign_name: 'Untitled Email',
          lower_campaign_name: 'untitled email',
          locale: 'en_us',
          modules_data: [{
            _id: '5b3ce34792f8ef00137bb105',
            type: 'virtual',
            key: 'text_458798',
            name: 'text',
            structure: {},
            plugins: {},
            status: 'publish',
            updated_at: '2018-08-03 16:09:09',
            created_at: '2018-07-04 11:09:59',
            isFixed: true,
            fixedPosition: 0,
            mandatory: true,
          }],
        },
      };

      store.commit('campaign/loadCampaignData', newStruct);
      store.commit('campaign/campaignCanBeProcessed', status);

      let stateCampaignBeProcessed = store.state.campaign.campaign.campaign_data.can_be_processed;

      expect(stateCampaignBeProcessed).toBeTruthy();

      status = null;
      newStruct = null;
      stateCampaignBeProcessed = null;

      done();
    });
    it('"loadCampaignData" and expect of set "campaign" state a new data object', (done) => {
      let campaignData = {
        campaign_name: 'Untitled Email',
        locale: 'en_us',
        campaign_id: '5b64b80f02a4cd00160fade2',
        campaign_data: {
          _id: '5b64b80f02a4cd00160fade2',
          campaign_name: 'Untitled Email',
          lower_campaign_name: 'untitled email',
          locale: 'en_us',
          modules_data: [{
            _id: '5b3ce34792f8ef00137bb105',
            type: 'virtual',
            key: 'text_458798',
            name: 'text',
            structure: {},
            plugins: {},
            status: 'publish',
            updated_at: '2018-08-03 16:09:09',
            created_at: '2018-07-04 11:09:59',
            isFixed: true,
            fixedPosition: 0,
            mandatory: true,
          }],
        },
      };

      store.commit('campaign/loadCampaignData', campaignData);

      let stateCampaign = store.state.campaign.campaign;

      expect(stateCampaign).toEqual(campaignData);

      campaignData = null;
      stateCampaign = null;

      done();
    });
    it('"updateEmailCanvas" and expect has set "modules" state, a new array of modules', (done) => {
      let modulesData = [{
        _id: '5b3ce34792f8ef00137bb105',
        type: 'virtual',
        key: 'text_458798',
        name: 'text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:09:09',
        created_at: '2018-07-04 11:09:59',
        isFixed: true,
        fixedPosition: 0,
        mandatory: true,
      },
      {
        _id: '5b64bf6602a4cd00122d0353',
        type: 'studio',
        key: 'banner',
        name: 'banner',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-04 12:41:49',
        created_at: '2018-08-03 16:47:34',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 860980,
      },
      {
        _id: '5b64bb6902a4cd00153af972',
        type: 'studio',
        key: 'body',
        name: 'body',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:30:33',
        created_at: '2018-08-03 16:30:33',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 169033,
      },
      {
        _id: '5b64b74a02a4cd000d42aad2',
        type: 'studio',
        key: 'untitled_module',
        name: 'text image',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-04 12:42:51',
        created_at: '2018-08-03 16:12:58',
        data: [],
        idInstance: 567456,
      },
      {
        _id: '5b64b94002a4cd0013159bf2',
        type: 'studio',
        key: 'image_text',
        name: 'image text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-04 12:42:15',
        created_at: '2018-08-03 16:21:20',
        data: [],
        idInstance: 278717,
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);

      let stateModules = store.state.campaign.modules;

      expect(stateModules).toEqual(modulesData);

      modulesData = null;
      stateModules = null;

      done();
    });
    it('"changeBuildingMode" and expect has set "buildingMode" state, to mobile', (done) => {
      let modulesData = 'mobile';

      store.commit('campaign/changeBuildingMode', modulesData);

      let stateBuildingMode = store.state.campaign.buildingMode;

      expect(stateBuildingMode).toEqual(modulesData);

      modulesData = null;
      stateBuildingMode = null;

      done();
    });
    it('"setDirty" and expect of set "dirty" state to true', (done) => {
      let dirty = true;

      store.commit('campaign/setDirty', dirty);

      let stateDirty = store.state.campaign.dirty;

      expect(stateDirty).toBeTruthy();

      dirty = null;
      stateDirty = null;

      done();
    });
    it('"setUpdatedAt" and expect of set "campaign.campaign_data.updated_at" state, update date', (done) => {
      let updatedAt = '2018-08-04 16:53:53.000000';
      let newStruct = {
        campaign_data: {
          updated_at: '',
        },
      };

      store.commit('campaign/loadCampaignData', newStruct);
      store.commit('campaign/setUpdatedAt', updatedAt);

      let stateCampaignUpdateAt = store.state.campaign.campaign.campaign_data.updated_at;

      expect(stateCampaignUpdateAt).toEqual(updatedAt);

      updatedAt = null;
      newStruct = null;
      stateCampaignUpdateAt = null;

      done();
    });
    xit('"setToggleImageEditor"', () => {});
    it('"setToggleModuleSettings" and expect of set "showModuleSettings" state to true', (done) => {
      let toggleValue = true;

      store.commit('campaign/setToggleModuleSettings', toggleValue);

      let stateShowModuleSettings = store.state.campaign.showModuleSettings;

      expect(stateShowModuleSettings).toBeTruthy();

      toggleValue = null;
      stateShowModuleSettings = null;

      done();
    });
    xit('"addModule"', () => {});
    it('"insertModule" expect to insert a module in "modules" state, in index 0', (done) => {
      let objModule = {
        index: 0,
        moduleData: {
          _id: '5b804c95aa96550018023592',
          type: 'studio',
          key: 'body',
          name: 'body',
          structure: {},
          plugins: {},
          status: 'publish',
          updated_at: '2018-08-24 15:01:32',
          created_at: '2018-08-24 14:21:09',
          isFixed: false,
          mandatory: false,
          data: {},
          idInstance: 150259,
        },
      };

      store.commit('campaign/insertModule', objModule);

      let stateFirstModule = store.state.campaign.modules[objModule.index];

      expect(stateFirstModule).toEqual(objModule.moduleData);

      objModule = null;
      stateFirstModule = null;

      done();
    });
    xit('"cloneModule" ', () => {});
    xit('"updateCustomElement" ', () => {});
    it('"updateCustomElementProperty" expect to update data of element', (done) => {
      let payload = {
        moduleId: 0,
        subComponent: 'textContent',
        property: 'background',
        value: '#000',
      };

      let newStruct = [{
        _id: '5b3ce34792f8ef00137bb105',
        type: 'virtual',
        key: 'text_458798',
        name: 'text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:09:09',
        created_at: '2018-07-04 11:09:59',
        isFixed: true,
        data: {
          textContent: {
            background: '#fff',
          },
        },
        fixedPosition: 0,
        mandatory: true,
      }];

      store.commit('campaign/updateEmailCanvas', newStruct);
      store.commit('campaign/updateCustomElementProperty', payload);

      let stateDataModule = store.state.campaign.modules[payload.moduleId].data.textContent;

      expect(stateDataModule).toHaveProperty(payload.property, payload.value);

      payload = null;
      newStruct = null;
      stateDataModule = null;

      done();
    });
    it('"updateCustomElementProperty" without moduleId, expect return a new error', (done) => {
      let payload = {
        subComponent: 'text-content',
        property: 'background',
        value: '#000',
      };

      let newStruct = [{
        _id: '5b3ce34792f8ef00137bb105',
        type: 'virtual',
        key: 'text_458798',
        name: 'text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:09:09',
        created_at: '2018-07-04 11:09:59',
        isFixed: true,
        data: {},
        fixedPosition: 0,
        mandatory: true,
      }];

      store.commit('campaign/updateEmailCanvas', newStruct);

      expect(() => store.commit('campaign/updateCustomElementProperty', payload)).toThrow('moduleId is undefined');

      payload = null;
      newStruct = null;

      done();
    });
    it('"saveSetting" with setting object, expect to set the key with a new value', (done) => {
      let setting = {
        name: 'tags',
        value: ['tag', 'test'],
      };

      store.commit('campaign/saveSetting', setting);

      let stateEditedSettings = store.state.campaign.editedSettings;

      expect(stateEditedSettings).toHaveProperty(setting.name, setting.value);

      setting = null;
      stateEditedSettings = null;

      done();
    });
    it('"saveCampaignData" with data, expect to save a new data or update this', (done) => {
      let payload = {
        name: 'campaign_settings',
        value: {
          templateBackgroundColor: '#000999',
        },
      };
      let newStruct = {
        campaign_data: {
          campaign_settings: [],
          auto_save: false,
        },
      };

      store.commit('campaign/loadCampaignData', newStruct);
      store.commit('campaign/saveCampaignData', payload);

      let stateSaveCampaignData = store.state.campaign.campaign.campaign_data;

      expect(stateSaveCampaignData).toHaveProperty(payload.name, payload.value);

      payload = null;
      newStruct = null;
      stateSaveCampaignData = null;

      done();
    });
    it('"toggleModal" with nameModal, expect to change the Boolean status', (done) => {
      store.commit('campaign/toggleModal', 'modalCode');
      store.commit('campaign/toggleModal', 'modalComplete');
      store.commit('campaign/toggleModal', 'modalPreview');
      store.commit('campaign/toggleModal', 'modalProof');
      store.commit('campaign/toggleModal', 'modalProofTrack');
      store.commit('campaign/toggleModal', 'modalEnableTemplating');
      store.commit('campaign/toggleModal', 'modalEsp');

      let stateToggleModalModalCode = store.state.campaign.modalCode;
      let stateToggleModalModalComplete = store.state.campaign.modalComplete;
      let stateToggleModalModalPreview = store.state.campaign.modalPreview;
      let stateToggleModalModalProof = store.state.campaign.modalProof;
      let stateToggleModalModalProofTrack = store.state.campaign.modalProofTrack;
      let stateToggleModalModalEnableTemplating = store.state.campaign.modalEnableTemplating;
      let stateToggleModalModalEsp = store.state.campaign.modalEsp;

      expect(stateToggleModalModalCode).toBeTruthy();
      expect(stateToggleModalModalComplete).toBeTruthy();
      expect(stateToggleModalModalPreview).toBeTruthy();
      expect(stateToggleModalModalProof).toBeTruthy();
      expect(stateToggleModalModalProofTrack).toBeTruthy();
      expect(stateToggleModalModalEnableTemplating).toBeTruthy();
      expect(stateToggleModalModalEsp).toBeTruthy();

      stateToggleModalModalCode = null;
      stateToggleModalModalComplete = null;
      stateToggleModalModalPreview = null;
      stateToggleModalModalProof = null;
      stateToggleModalModalProofTrack = null;
      stateToggleModalModalEnableTemplating = null;
      stateToggleModalModalEsp = null;

      done();
    });
    xit('"toggleModal" with nameModal not defined, expect to throw error message', (done) => {
      expect(() => store.commit('campaign/toggleModal', 'modalUndefined')).toThrow('nameModal Undefined');
      done();
    });
    it('"removeModule" with number of module position, expect to has removed the module', (done) => {
      let modulesData = [{
        _id: '5b3ce34792f8ef00137bb105',
        type: 'virtual',
        key: 'text_458798',
        name: 'text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:09:09',
        created_at: '2018-07-04 11:09:59',
        isFixed: true,
        fixedPosition: 0,
        mandatory: true,
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/removeModule', 0);

      let stateModules = store.state.campaign.modules;

      expect(stateModules).toBeEmptyArray();

      modulesData = null;
      stateModules = null;

      done();
    });
    it('"setProcessStatus" , expect to change status Boolean to true', (done) => {
      let newStruct = {
        campaign_data: {
          processed: false,
        },
      };

      store.commit('campaign/loadCampaignData', newStruct);
      store.commit('campaign/setProcessStatus');

      let stateModules = store.state.campaign.campaign.campaign_data.processed;

      expect(stateModules).toBeTruthy();

      newStruct = null;
      stateModules = null;

      done();
    });
    it('"setCurrentComponent" with data, expect to set the "currentComponent" state', (done) => {
      let data = { moduleId: 0, columnId: 0, componentId: 0 };

      store.commit('campaign/setCurrentComponent', data);

      let stateCurrentComponent = store.state.campaign.currentComponent;

      expect(stateCurrentComponent).toEqual(data);

      data = null;
      stateCurrentComponent = null;

      done();
    });
    it('"unsetCurrentComponent" , expect to clean the "currentComponent" state', (done) => {
      store.commit('campaign/unsetCurrentComponent');

      let stateCurrentComponent = store.state.campaign.currentComponent;

      expect(stateCurrentComponent).toBeEmptyObject();

      stateCurrentComponent = null;

      done();
    });
    it('"setActiveModule" with moduleId, expect to set "activeModule" state with a index of module', (done) => {
      let data = 0;

      store.commit('campaign/setActiveModule', data);

      let stateActiveModule = store.state.campaign.activeModule;

      expect(stateActiveModule).toEqual(0);

      data = null;
      stateActiveModule = null;

      done();
    });
    it('"unsetActiveModule", expect to remove of "activeModule" state the data', (done) => {
      store.commit('campaign/unsetActiveModule');

      let stateActiveModule = store.state.campaign.activeModule;

      expect(stateActiveModule).toBeUndefined();

      stateActiveModule = null;

      done();
    });
    it('"setActiveLastModule", expect to set "activeModule" state with a index of last module', (done) => {
      let modulesData = [{
        _id: '5b3ce34792f8ef00137bb105',
        type: 'virtual',
        key: 'text_458798',
        name: 'text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:09:09',
        created_at: '2018-07-04 11:09:59',
        isFixed: true,
        fixedPosition: 0,
        mandatory: true,
      },
      {
        _id: '5b64bf6602a4cd00122d0353',
        type: 'studio',
        key: 'banner',
        name: 'banner',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-04 12:41:49',
        created_at: '2018-08-03 16:47:34',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 860980,
      },
      {
        _id: '5b64bb6902a4cd00153af972',
        type: 'studio',
        key: 'body',
        name: 'body',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-03 16:30:33',
        created_at: '2018-08-03 16:30:33',
        isFixed: false,
        mandatory: false,
        data: [],
        idInstance: 169033,
      },
      {
        _id: '5b64b74a02a4cd000d42aad2',
        type: 'studio',
        key: 'untitled_module',
        name: 'text image',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-04 12:42:51',
        created_at: '2018-08-03 16:12:58',
        data: [],
        idInstance: 567456,
      },
      {
        _id: '5b64b94002a4cd0013159bf2',
        type: 'studio',
        key: 'image_text',
        name: 'image text',
        structure: {},
        plugins: {},
        status: 'publish',
        updated_at: '2018-08-04 12:42:15',
        created_at: '2018-08-03 16:21:20',
        data: [],
        idInstance: 278717,
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/setActiveLastModule');

      let stateActiveModule = store.state.campaign.activeModule;

      expect(stateActiveModule).toEqual(4);

      modulesData = null;
      stateActiveModule = null;

      done();
    });
    xit('"saveComponent" with data, expect to save the component data', () => {});
    it('"savePlugin" with data, expect to save or update the data of plugin', (done) => {
      let payload = {
        plugin: 'styleImageEditor',
        moduleId: 0,
        columnId: 0,
        componentId: 0,
        data: {
          img: 'campaigns/5b86a76baa96550016453356/en_us/5b8d42c3adfb8-1535984323.7126.png',
          state: {
            size: {
              width: 300,
              height: 200,
              auto: false,
              minHeight: 100,
              maxHeight: 1000,
              fit: '1',
              minWidth: 1,
              scale: 2,
            },
            outputSize: {
              height: 200,
              width: 300,
              auto: false,
              minHeight: 100,
              maxHeight: 1000,
              fit: '1',
              minWidth: 1,
              scale: 2,
            },
            preset: [{
              type: 'sie-plugin-image',
              options: {
                plugin: {
                  cropper: {
                    cropBoxResizable: false,
                    movable: true,
                    scalable: true,
                    rotatable: false,
                    zoomable: true,
                    zoomOnTouch: false,
                    zoomOnWheel: true,
                    enable: true,
                    roundCrop: {
                      enable: false,
                    },
                    viewMode: 3,
                    dragMode: 'move',
                    modal: true,
                    guides: false,
                    center: false,
                    highlight: false,
                    background: false,
                    autoCropArea: 1,
                    toggleDragModeOnDblclick: false,
                    cropBoxMovable: false,
                    minContainerWidth: 1,
                    minContainerHeight: 1,
                    minCanvasWidth: 1,
                    minCanvasHeight: 1,
                    minCropBoxWidth: 1,
                    minCropBoxHeight: 100,
                    restore: false,
                    state: {
                      data: {
                        x: 0,
                        y: 167,
                        width: 1000,
                        height: 666,
                        scaleX: 1,
                        scaleY: 1,
                      },
                      canvas: {
                        left: 0,
                        top: -50,
                        width: 300,
                        height: 300,
                        naturalWidth: 1000,
                        naturalHeight: 1000,
                      },
                      cropbox: {
                        left: 0,
                        top: 0,
                        width: 300,
                        height: 200,
                      },
                      roundCrop: {
                        round: {
                          enable: false,
                          only: false,
                          diameter: 300,
                        },
                        active: false,
                      },
                    },
                  },
                  upload: {
                    url: 'campaigns/5b86a76baa96550016453356/en_us/5b8d3f0906618-1535983369.0262.jpg',
                    fillColor: '#000000',
                    gif: false,
                  },
                },
                layer: {
                  description: '',
                  visible: true,
                },
              },
            },
            ],
          },
        },
      };
      let modulesData = [{
        structure: {
          columns: [{
            components: [{
              plugins: {
                styleImageEditor: {
                  data: {},
                },
              },
            }],
          },
          ],
        },
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/savePlugin', payload);

      let stateModulesPlugin = store.state.campaign.modules[payload.moduleId].structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].data;
      let stateDirty = store.state.campaign.dirty;

      expect(stateModulesPlugin).toEqual(payload.data);
      expect(stateDirty).toBeTruthy();

      payload = null;
      modulesData = null;
      stateModulesPlugin = null;
      stateDirty = null;

      done();
    });
    it('"saveComponentProperty" with data, expect to save the new properties data', (done) => {
      let data = {
        plugin: 'styleImageEditor',
        moduleId: 0,
        columnId: 0,
        componentId: 0,
        subComponent: 'image',
        link: 'attribute',
        value: 'campaigns/5b86a76baa96550016453356/en_us/5b8ef0cc06930-1536094412.0269.png',
        property: 'placeholder',
      };
      let data2 = {
        plugin: 'styleImageEditor',
        moduleId: 0,
        columnId: 0,
        componentId: 0,
        link: 'attribute',
        value: 'campaigns/5b86a76baa96550016453356/en_us/5b8ef0cc06930-1536094412.0269.png',
        property: 'placeholder',
      };
      let data3 = {
        plugin: 'styleImageEditor',
        moduleId: 0,
        columnId: 0,
        componentId: 0,
        value: 'campaigns/5b86a76baa96550016453356/en_us/5b8ef0cc06930-1536094412.0269.png',
        property: 'placeholder',
      };
      let modulesData = [{
        structure: {
          columns: [{
            components: [{
              image: {
                attribute: {
                  placeholder: '',
                },
              },
              attribute: {
                placeholder: '',
              },
              placeholder: '',
            },
            ],
          },
          ],
        },
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/saveComponentProperty', data);
      store.commit('campaign/saveComponentProperty', data2);
      store.commit('campaign/saveComponentProperty', data3);

      let stateModulescomponent = store.state.campaign.modules[data.moduleId].structure.columns[data.columnId].components[data.componentId];
      let stateDirty = store.state.campaign.dirty;

      expect(stateModulescomponent.image.attribute.placeholder).toEqual(data.value);
      expect(stateModulescomponent.attribute.placeholder).toEqual(data.value);
      expect(stateModulescomponent.placeholder).toEqual(data.value);
      expect(stateDirty).toBeTruthy();

      data = null;
      data2 = null;
      data3 = null;
      modulesData = null;
      stateModulescomponent = null;
      stateDirty = null;

      done();
    });
    xit('"saveComponentAttribute" ,', () => {});
    it('"saveColumnAttribute" with data, to expect to update the attribute', (done) => {
      let data = {
        plugin: 'columnBackgroundColor',
        moduleId: 0,
        columnId: 0,
        attribute: 'bgcolor',
        attributeValue: '#000000',
      };
      let modulesData = [{
        structure: {
          columns: [{
            container: {
              attribute: {
                width: '50%',
                valign: 'middle',
                bgcolor: '#B01F1F',
              },
            },
          },
          ],
        },
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/saveColumnAttribute', data);

      let stateModulescomponent = store.state.campaign.modules[data.moduleId].structure.columns[data.columnId].container.attribute;

      expect(stateModulescomponent).toHaveProperty(data.attribute, data.attributeValue);

      data = null;

      modulesData = null;
      stateModulescomponent = null;

      done();
    });
    it('"saveColumnAttribute" with data, to expect insert a new attribute', (done) => {
      let data = {
        plugin: 'columnBackgroundColor',
        moduleId: 0,
        columnId: 0,
        attribute: 'bgcolor',
        attributeValue: '#B01F1F',
      };
      let modulesData = [{
        structure: {
          columns: [{
            container: {
              attribute: {
                width: '50%',
                valign: 'middle',
              },
            },
          },
          ],
        },
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/saveColumnAttribute', data);

      let stateModulescomponent = store.state.campaign.modules[data.moduleId].structure.columns[data.columnId].container.attribute;

      expect(stateModulescomponent).toHaveProperty(data.attribute, data.attributeValue);

      data = null;

      modulesData = null;
      stateModulescomponent = null;

      done();
    });
    xit('"saveModuleAttribute" , ', () => {});
    xit('"saveModuleData" ,', () => {});
    it('"saveCustomModuleData" with data, to expect save the data', (done) => {
      let data = {
        moduleId: 0,
        columnId: 0,
        plugin: 'heightSync',
        data: {
          heightSync: {
            height: 125,
          },
        },
      };
      let modulesData = [{
        data: {
          heightSync: {
            height: 0,
          },
        },
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/saveCustomModuleData', data);

      let stateModulesPlugin = store.state.campaign.modules[data.moduleId].data;

      expect(stateModulesPlugin).toEqual(data.data);

      data = null;
      modulesData = null;
      stateModulesPlugin = null;

      done();
    });
    xit('"saveCustomModuleImageData"', () => {});
    xit('"saveCustomModuleDataField"', () => {});
    xit('"saveCustomModuleParamsField"', () => {});
    xit('"setEditorOptions"', () => {});
    it('"setCurrentModule with moduleId, expect to set value de current module"', (done) => {
      let moduleId = 0;

      store.commit('campaign/setCurrentModule', moduleId);

      let stateCurrentModuleId = store.state.campaign.currentModuleId;

      expect(stateCurrentModuleId).toEqual(moduleId);

      moduleId = null;
      stateCurrentModuleId = null;

      done();
    });
    it('"unsetCurrentModule, expect to set value to undefined"', (done) => {
      let moduleId = 0;

      store.commit('campaign/setCurrentModule', moduleId);
      store.commit('campaign/unsetCurrentModule');

      let stateCurrentModuleId = store.state.campaign.currentModuleId;

      expect(stateCurrentModuleId).toBeUndefined();

      moduleId = null;
      stateCurrentModuleId = null;

      done();
    });
    it('"setCustomModule with data, expect to set value de current custom module"', (done) => {
      let moduleId = 0;

      store.commit('campaign/setCustomModule', moduleId);


      let stateCurrentModuleId = store.state.campaign.currentCustomModuleId;

      expect(stateCurrentModuleId).toEqual(moduleId);

      moduleId = null;
      stateCurrentModuleId = null;

      done();
    });
    it('"unsetCustomModule, expect to set value de current custom to undefined"', (done) => {
      let moduleId = 0;

      store.commit('campaign/setCustomModule', moduleId);
      store.commit('campaign/unsetCustomModule');

      let stateCurrentModuleId = store.state.campaign.currentCustomModuleId;

      expect(stateCurrentModuleId).toBeUndefined();

      moduleId = null;
      stateCurrentModuleId = null;

      done();
    });
    it('"setTemplating" with data, expect to set campaign_data.template to true', (done) => {
      let templating = true;
      let campaignData = {
        campaign_data: {
          modules_data: {},
          template: false,
        },
      };

      store.commit('campaign/loadCampaignData', campaignData);
      store.commit('campaign/setTemplating', templating);

      let stateCampaignTemplating = store.state.campaign.campaign.campaign_data.template;

      expect(stateCampaignTemplating).toBeTruthy();

      templating = null;
      campaignData = null;
      stateCampaignTemplating = null;

      done();
    });
    xit('"addError" with data, expect to push the error to fieldError', (done) => {
      let errorMessage1 = {
        error: {
          scope: {
            type: 'plugin',
            name: 'plugin.name',
            moduleId: 0,
            columnId: 0,
            componentId: 0,
          },
        },
      };
      let errorMessage2 = {
        error: {
          scope: {
            type: 'plugin',
            name: 'plugin',
            moduleId: 1,
            columnId: 0,
            componentId: 0,
          },
        },
      };

      store.commit('campaign/addError', errorMessage1);
      store.commit('campaign/addError', errorMessage2);

      let stateCampaignFieldError = store.state.campaign.fieldErrors;

      expect(stateCampaignFieldError[0]).toEqual('typeError:unknow');
      expect(stateCampaignFieldError[1]).toEqual('typeError:unknow type');

      errorMessage1 = null;
      errorMessage2 = null;
      stateCampaignFieldError = null;

      done();
    });
    xit('"clearErrorsByModuleId", with moduleId, expect to clean', (done) => {
      let moduleId = 0;

      let errorMessage1 = {
        scope: {
          type: 'plugin',
          name: 'plugin.name',
          moduleId: 0,
          columnId: 0,
          componentId: 0,
          clearErrorsByModuleId: 0,
        },
      };
      let errorMessage2 = {
        scope: {
          type: 'plugin',
          name: 'plugin',
          moduleId: 1,
          columnId: 0,
          componentId: 0,
          clearErrorsByModuleId: 0,
        },
      };
      let modulesData = [{
        data: {
          errors: [],
        },
      },
      {
        data: {
          errors: [],
        },
      }];

      store.commit('campaign/updateEmailCanvas', modulesData);
      store.commit('campaign/addError', errorMessage1);
      store.commit('campaign/addError', errorMessage2);
      store.commit('campaign/clearErrorsByModuleId', moduleId);
      let storeModulesErorrs1 = store.state.campaign.modules[0].data;
      let storeModulesErorrs2 = store.state.campaign.modules[1].data;

      expect(storeModulesErorrs1).toEqual(errorMessage2);
      expect(storeModulesErorrs2).not.toBe(errorMessage1);

      moduleId = modulesData = errorMessage1 = errorMessage2 = storeModulesErorrs1 = storeModulesErorrs2 = null;


      done();
    });
    xit('"clearErrorsByScope"', () => {});
    it('"setCampaignName" with name, expect to set the name of campaign', (done) => {
      let name = 'campaign of tests';
      let campaignData = {
        campaign_data: {},
      };

      store.commit('campaign/loadCampaignData', campaignData);
      store.commit('campaign/setCampaignName', name);

      let stateCampaignName = store.state.campaign.campaign.campaign_data.campaign_name;

      expect(stateCampaignName).toEqual(name);

      name = null;
      campaignData = null;
      stateCampaignName = null;

      done();
    });
    it('"error" with message error, expect to trigger console error', (done) => {
      let messageError = 'type error';

      store.commit('campaign/error', messageError);

      expect(console.error).toHaveBeenCalled();

      messageError = null;

      done();
    });
  });

  describe('trigger actions', () => {
    let baseUrl = '';
    beforeAll(() => {
      baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
    });
    afterAll(() => {
      nock.cleanAll();
      nock.restore();
      baseUrl = null;
    });

    it('"updateCustomElement" with \'payload\' data, expect call to "updateCustomElement" mutation', async (done) => {
      let payload = {};
      let setDataMock = jest.fn();
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          updateCustomElement: setDataMock,
        },
        actions: storeCampaign.actions,
      });
      await campStore.dispatch('updateCustomElement', payload).then(() => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][1]).toEqual({});
        payload = setDataMock = storeCampaign = campStore = null;
        done();
      });
    });
    it('"updateText" with \'payload\' data, expect to call "saveComponentProperty" mutation', (done) => {
      let setDataMock = jest.fn();
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          saveComponentProperty: setDataMock,
        },
        actions: storeCampaign.actions,
      });
      let payload = {
        moduleId: 0,
        columnId: 0,
        componentId: 0,
        link: 'data',
        property: 'text',
        sync: false,
        value: '<p style="margin: 0px;" data-mce-style="margin: 0px;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam volasduptua.</p>',
      };

      let payload2 = {
        moduleId: 0,
        columnId: 0,
        componentId: 0,
        link: 'data',
        sync: true,
      };

      campStore.dispatch('updateText', payload);

      expect(setDataMock.mock.calls).toHaveLength(1);
      expect(setDataMock.mock.calls[0][1]).toEqual(payload);

      campStore.dispatch('updateText', payload2);

      expect(setDataMock.mock.calls).toHaveLength(3);

      expect(setDataMock.mock.calls[1][1]).toEqual(payload2);
      expect(setDataMock.mock.calls[2][1]).toMatchObject({ ...payload2, value: expect.any(Number) });

      setDataMock = storeCampaign = payload = campStore = payload2 = null;

      done();
    });
    it('"updateCustomElementProperty" with \'payload\' data, expect call to "updateCustomElementProperty" mutation', async (done) => {
      let payload = {};
      let setDataMock = jest.fn();
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          updateCustomElementProperty: setDataMock,
        },
        actions: storeCampaign.actions,
      });
      await campStore.dispatch('updateCustomElementProperty', payload).then(() => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][1]).toEqual({});
        payload = setDataMock = storeCampaign = campStore = null;
        done();
      });
    });
    xit('"addErrors"', () => {});
    xit('"saveCustomModuleData"', () => {});
    it('"getCampaignData" with \'campaignId\' data, expect call to "loadCampaignData" mutation, and get the data of campaign', async (done) => {
      let setDataMock = jest.fn();
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          loadCampaignData: setDataMock,
        },
        actions: storeCampaign.actions,
      });
      let resultGetCampaign = mocks.campaign.getCampaign;
      resultGetCampaign.campaign.campaign_data.auto_save = null;
      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/campaign/data/5b045affe53553000d59b18c')
        .reply(200, resultGetCampaign);
      await campStore.dispatch('getCampaignData', '5b045affe53553000d59b18c').then(() => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        resultGetCampaign.campaign.campaign_data.auto_save = true;
        expect(setDataMock.mock.calls[0][1]).toEqual(resultGetCampaign.campaign);
        setDataMock = storeCampaign = campStore = resultGetCampaign = null;
        done();
      });
    });
    it('"getCampaignData" with \'campaignId\' data erroneous, expect call to "error" mutation', async (done) => {
      let responseRequest = '';
      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/campaign/data/5b')
        .reply(500, responseRequest);

      await store.dispatch('campaign/getCampaignData', '5b').then(() => {
        expect(console.error).toHaveBeenCalled();
        responseRequest = null;
        done();
      });
    });
    it('"getCampaignDataPublic", with \'campaignId\' data, expect call to "loadCampaignData" mutation, and get the data of campaign', async (done) => {
      let setDataMock = jest.fn();
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          loadCampaignData: setDataMock,
        },
        actions: storeCampaign.actions,
      });

      let resultGetCampaign = mocks.campaign.getCampaignPublic;

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/public/get/5bae3210a7082a001559ec93')
        .reply(200, resultGetCampaign);

      await campStore.dispatch('getCampaignDataPublic', '5bae3210a7082a001559ec93').then(() => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][1]).toEqual(resultGetCampaign.campaign);
        setDataMock = storeCampaign = campStore = resultGetCampaign = null;
        done();
      });
    });
    it('"getCampaignDataPublic" with \'campaignId\' data erroneous, expect call to "error" mutation', async (done) => {
      let responseRequest = '';
      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get('/public/get/5b')
        .reply(500, responseRequest);

      await store.dispatch('campaign/getCampaignDataPublic', '5b').then(() => {
        expect(console.error).toHaveBeenCalled();
        responseRequest = null;
        done();
      });
    });
    xit('"saveCampaign" with data, expect to save campaign', (done) => {
      let resultSaveCampaign = mocks.campaign.saveCampaign;
      let bodyJson = { campaign: mocks.campaign.saveCampaign.campaign, bodyHtml: mocks.campaign.saveCampaign.campaign.body_html };
      let data = {};
      data.campaign = mocks.campaign.saveCampaign.campaign;
      let setDataMock1 = jest.fn();
      let setDataMock2 = jest.fn();
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          setDirty: setDataMock1,
          setUpdatedAt: setDataMock2,
        },
        actions: storeCampaign.actions,
      });
      let setting = {
        name: 'tags',
        value: ['tag', 'test'],
      };
      let newStruct = {
        campaign_data: mocks.campaign.saveCampaign.campaign,
      };

      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('campaign/save', bodyJson)
        .reply(200, resultSaveCampaign);

      realStore.commit('loadCampaignData', newStruct);
      realStore.commit('saveSetting', setting);
      campStore.dispatch('saveCampaign', data).then(() => {
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls).toHaveLength(1);

        resultSaveCampaign = bodyJson = data = setDataMock1 = setDataMock2 = storeCampaign = campStore = setting = newStruct = null;
        done();
      });
    });
    xit('"completeCampaign"', (done) => {
      let data = {};
      data.campaign = mocks.campaign.saveCampaign.campaign;
      let setDataMock1 = jest.fn();
      let setDataMock2 = jest.fn();
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          setDirty: setDataMock1,
        },
        actions: {
          ...storeCampaign.actions,
          getCampaignData: setDataMock2,
        },
      });
      nock(baseUrl)
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .post('/campaign/process', { campaign_id: '5bae3210a7082a001559ec93' })
        .reply(200, { processed: '5bae3210a7082a001559ec93' });

      campStore.dispatch('completeCampaign', data).then(() => {
        data = setDataMock1 = setDataMock2 = storeCampaign = campStore = null;
        done();
      });
    });
    it('"lockCampaign" with data, expect to call "getCampaignData" action and "lockCampaign" of the \'campaignService\'', async (done) => {
      let setDataMock1 = jest.fn();
      let setDataMock2 = jest.fn().mockResolvedValue({ campaign_id: '5bae3210a7082a001559ec93' });
      let campaignId = '5bae3210a7082a001559ec93';
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: storeCampaign.mutations,
        actions: {
          ...storeCampaign.actions,
          getCampaignData: setDataMock1,
        },
      });
      campaignService.lockCampaign = setDataMock2;

      await campStore.dispatch('lockCampaign', campaignId).then(() => {
        expect(setDataMock2.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls[0][0]).toEqual('5bae3210a7082a001559ec93');
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock1.mock.calls[0][1]).toEqual('5bae3210a7082a001559ec93');
        campaignId = storeCampaign = campStore = setDataMock1 = setDataMock2 = null;
        done();
      });
    });
    it('"lockCampaign" with data erroneous, expect to call "error" mutation', async (done) => {
      let setDataMock1 = jest.fn();
      let error = new Error('{ message: "No query results for model [Stensul\\Models\\Campaign] 5b" }');
      let setDataMock2 = jest.fn().mockRejectedValue(error);
      let campaignId = '5b';
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          error: setDataMock1,
        },
        actions: storeCampaign.actions,
      });
      campaignService.lockCampaign = setDataMock2;

      await campStore.dispatch('lockCampaign', campaignId).then(() => { }).catch(() => {
        expect(setDataMock2.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls[0][0]).toEqual('5b');
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock1.mock.calls[0][1]).toEqual(error);
        campaignId = storeCampaign = campStore = setDataMock1 = setDataMock2 = error = null;
        done();
      });
    });
    it('"unlockCampaign" with data, expect to call "getCampaignData" action and "unlockCampaign" of the \'campaignService\'', async (done) => {
      let setDataMock1 = jest.fn();
      let setDataMock2 = jest.fn().mockResolvedValue({ campaign_id: '5bae3210a7082a001559ec93' });
      let campaignId = '5bae3210a7082a001559ec93';
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: storeCampaign.mutations,
        actions: {
          ...storeCampaign.actions,
          getCampaignData: setDataMock1,
        },
      });
      campaignService.unlockCampaign = setDataMock2;

      await campStore.dispatch('unlockCampaign', campaignId).then(() => {
        expect(setDataMock2.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls[0][0]).toEqual('5bae3210a7082a001559ec93');
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock1.mock.calls[0][1]).toEqual('5bae3210a7082a001559ec93');
        campaignId = storeCampaign = campStore = setDataMock1 = setDataMock2 = null;
        done();
      });
    });
    it('"pingLockCampaign" with data erroneous, expect to call "error" mutation', async (done) => {
      let setDataMock1 = jest.fn();
      let error = new Error('{ message: "No query results for model [Stensul\\Models\\Campaign] 5b" }');
      let setDataMock2 = jest.fn().mockRejectedValue(error);
      let data = {};
      data.campaignId = '5b';
      data.windowId = undefined;
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          error: setDataMock1,
        },
        actions: storeCampaign.actions,
      });
      campaignService.pingLock = setDataMock2;

      await campStore.dispatch('pingLockCampaign', data).then(() => { }).catch(() => {
        expect(setDataMock2.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls[0][0]).toEqual(data);
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock1.mock.calls[0][1]).toEqual(error);
        data = storeCampaign = campStore = setDataMock1 = setDataMock2 = error = null;
        done();
      });
    });
    it('"favoriteCampaign" with campaignId, expect to call "getCampaignData" action and "favoriteCampaign" of the \'campaignService\'', async (done) => {
      let setDataMock1 = jest.fn();
      let setDataMock2 = jest.fn().mockResolvedValue({ campaign_id: '5bae3210a7082a001559ec93' });
      let campaignId = '5bae3210a7082a001559ec93';
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: storeCampaign.mutations,
        actions: {
          ...storeCampaign.actions,
          getCampaignData: setDataMock1,
        },
      });
      campaignService.favoriteCampaign = setDataMock2;

      await campStore.dispatch('favoriteCampaign', campaignId).then(() => {
        expect(setDataMock2.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls[0][0]).toEqual('5bae3210a7082a001559ec93');
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock1.mock.calls[0][1]).toEqual('5bae3210a7082a001559ec93');
        campaignId = storeCampaign = campStore = setDataMock1 = setDataMock2 = null;
        done();
      });
    });
    it('"favoriteCampaign" with campaignId erroneous, expect to call "error" mutation', async (done) => {
      let setDataMock1 = jest.fn();
      let error = new Error('{ message: "No query results for model [Stensul\\Models\\Campaign] 5b" }');
      let setDataMock2 = jest.fn().mockRejectedValue(error);
      let campaignId = '5b';
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          error: setDataMock1,
        },
        actions: storeCampaign.actions,
      });
      campaignService.favoriteCampaign = setDataMock2;

      await campStore.dispatch('favoriteCampaign', campaignId).then(() => { }).catch(() => {
        expect(setDataMock2.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls[0][0]).toEqual('5b');
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock1.mock.calls[0][1]).toEqual(error);
        campaignId = storeCampaign = campStore = setDataMock1 = setDataMock2 = error = null;
        done();
      });
    });
    it('"uploadImages" with data, expect to call "getCampaignData" action and "uploadImages" of the \'imageService\'', async (done) => {
      let setDataMock = jest.fn().mockResolvedValue(['/5bae3210a7082a001559ec93/en_us/5bb7bcddebe19-1538768093.9662.png']);
      let data = {
        images: [
          'data:image/jpeg;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        ],
        campaignId: '5bae3210a7082a001559ec93',
      };
      imageService.uploadImages = setDataMock;

      await store.dispatch('campaign/uploadImages', data).then((response) => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][0]).toEqual(data);
        expect(response).toEqual(['campaigns/5bae3210a7082a001559ec93/en_us/5bb7bcddebe19-1538768093.9662.png']);
        setDataMock = data = null;
        done();
      });
    });
    it('"uploadImages" with data erroneous, expect to call "error" mutation', async (done) => {
      let setDataMock1 = jest.fn();
      let responseError = new Error(
        `{
          "message": "Could not load image from string",
          "exception": "Imagine\\Exception\\RuntimeException",
          "file": "/usr/src/app/vendor/imagine/imagine/lib/Imagine/Imagick/Imagine.php",
          "line": 107,
          "trace": [
              {
                  "file": "/usr/src/app/vendor/laravel/framework/src/Illuminate/Support/Manager.php",
                  "line": 146,
                  "function": "load",
                  "class": "Imagine\\Imagick\\Imagine",
                  "type": "->"
              }
          ]
        }`,
      );
      let setDataMock2 = jest.fn().mockRejectedValue(responseError);
      let data = {
        images: [
          'data:image/jpeg;base64,',
        ],
        campaignId: '5bae3210a7082a001559ec93',
      };
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          error: setDataMock1,
        },
        actions: storeCampaign.actions,
      });
      imageService.uploadImages = setDataMock2;

      await campStore.dispatch('uploadImages', data).catch((error) => {
        expect(setDataMock2.mock.calls).toHaveLength(1);
        expect(setDataMock2.mock.calls[0][0]).toEqual(data);
        expect(setDataMock1.mock.calls).toHaveLength(1);
        expect(setDataMock1.mock.calls[0][1]).toEqual(error);
        setDataMock2 = setDataMock1 = storeCampaign = campStore = responseError = data = null;
        done();
      });
    });
    it('"sendPreview" with data, expect to call "sendPreview" of the \'campaignService\'', async (done) => {
      let data = {
        campaignId: '5bae3210a7082a001559ec93',
        mail: 'daniel@stensul.com',
        preheader: 'test',
        subject: 'prueba de mail',
      };
      let setDataMock = jest.fn().mockResolvedValue({ processed: ['daniel@stensul.com'] });
      campaignService.sendPreview = setDataMock;

      await store.dispatch('campaign/sendPreview', data).then((response) => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][0]).toEqual(data);
        expect(response).toEqual({ processed: ['daniel@stensul.com'] });
        data = setDataMock = null;
        done();
      });
    });
    it('"removeModule" with moduleId data, expect to call "removeModule" mutation', async (done) => {
      let setDataMock = jest.fn();
      let moduleId = 0;
      let storeCampaign = cloneDeep(campaignStore);
      let campStore = createStore({
        state: storeCampaign.state,
        getters: storeCampaign.getters,
        mutations: {
          ...storeCampaign.mutations,
          removeModule: setDataMock,
        },
        actions: storeCampaign.actions,
      });
      await campStore.dispatch('removeModule', moduleId).then(() => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][1]).toEqual(moduleId);
        moduleId = storeCampaign = campStore = setDataMock = null;
        done();
      });
    });
  });

  describe('trigger getters', () => {
    let storeCampaign = {};
    let campStore = {};
    beforeAll(() => {
      storeCampaign = cloneDeep(campaignStore);
      campStore = createStore({
        state: {
          campaign: {
            campaign_name: 'Untitled Email',
            locale: 'en_us',
            campaign_id: '5b045affe53553000d59b18c',
            campaign_data: {
              _id: '5b045affe53553000d59b18c',
              campaign_name: 'Untitled Email',
              lower_campaign_name: 'untitled email',
              locale: 'en_us',
              modules_data: [
                {
                  key: 'header',
                  name: 'Event Name/Date/Location/Logo ',
                  title: 'Event Name/Date/Location/Logo',
                  version: '0.0.1',
                  author: 'matias@stensul.com',
                  type: 'custom',
                  params: {
                    linkColor: '#006699',
                    colors: {
                      default: [
                        '000000',
                        'Black',
                      ],
                      gartner: [
                        '006699',
                        'Dark Blue',
                      ],
                      cios_senior_it_executives: [
                        '00457C',
                        'Dark Blue',
                      ],
                      applications: [
                        'E31836',
                        'Red',
                      ],
                      'data_&_analytics': [
                        'EE9A00',
                        'Orange',
                      ],
                      'enterprise_architecture_&_technology_innovation': [
                        '5A447A',
                        'Purple',
                      ],
                      'infrastructure_&_operations': [
                        '34B233',
                        'Green',
                      ],
                      'program_&_portfolio_management': [
                        'AF006E',
                        'Dark Pink',
                      ],
                      'security_&_risk_management': [
                        'C75B12',
                        'Dark Orange',
                      ],
                      'sourcing_&_vendor_relationships': [
                        '00A8B4',
                        'Light Blue',
                      ],
                      gartner_catalyst_conference: [
                        'EF4836',
                        'Red',
                      ],
                      gartner_digital_marketing_conference: [
                        '00ADEF',
                        'Light Blue',
                      ],
                      gartner_supply_chain_conference: [
                        'B6BE28',
                        'Gold',
                        '006699',
                        'Dark Blue',
                      ],
                      'gartner_tech_growth_&_innovation_conference': [
                        '66BE28',
                        'Green',
                      ],
                      symposium: [
                        '13233b',
                        'Blue',
                      ],
                    },
                    preheader: '100 characters with spaces max Main CTA here dis enit et quamet as sunt int link text here.',
                    options: {
                      option1: {
                        optionValue: 'option1',
                        label: 'Stack right image on top',
                      },
                      option2: {
                        optionValue: 'option2',
                        label: 'Stack left image on top',
                      },
                      option3: {
                        optionValue: 'option3',
                        label: 'Hide the right side image',
                      },
                      option4: {
                        optionValue: 'option4',
                        label: 'Place the right side image at the bottom of the email',
                      },
                    },
                    images: {
                      image0: {
                        destinationUrl: '#',
                        alt: '',
                        desktop: {
                          value: true,
                          config: {
                            library: {
                              value: true,
                              config: {
                                set_images: {
                                  value: 'test',
                                },
                              },
                            },
                            url: {
                              label: 'URL Upload',
                              key: 'url_upload',
                              value: false,
                              type: 'switch',
                            },
                            'sie-size': {
                              label: 'Size',
                              key: 'size',
                              type: 'label',
                              value: true,
                              config: {
                                size_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 260,
                                  type: 'number',
                                  step: 1,
                                },
                                size_auto: {
                                  label: 'Flexible height',
                                  key: 'auto',
                                  value: true,
                                  type: 'switch',
                                },
                                size_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 200,
                                  type: 'number',
                                  step: 1,
                                },
                                size_minHeight: {
                                  label: 'Min. Height',
                                  key: 'minHeight',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                size_fit: {
                                  label: 'Image Fit',
                                  key: 'fit',
                                  value: '2',
                                  type: 'select',
                                  options: [
                                    'Contain',
                                    'Cover',
                                    'Max Size',
                                  ],
                                },
                              },
                            },
                            'sie-plugin-image_upload': {
                              label: 'Upload',
                              key: 'upload',
                              type: 'label',
                              value: true,
                              config: {
                                uploaddefault: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                fillcolor: {
                                  label: 'Background color',
                                  key: 'fillColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                              },
                            },
                            'sie-plugin-image_cropper': {
                              label: 'Cropper',
                              key: 'enable',
                              type: 'switch',
                              value: true,
                              config: {
                                movable: {
                                  label: 'Enable Drag',
                                  key: 'movable',
                                  value: true,
                                  type: 'switch',
                                },
                                rotatable: {
                                  label: 'Enable rotation',
                                  key: 'rotatable',
                                  value: false,
                                  type: 'switch',
                                },
                                zoomable: {
                                  label: 'Enable zoom',
                                  key: 'zoomable',
                                  value: true,
                                  type: 'switch',
                                },
                                vertical: {
                                  label: 'Vertical crop',
                                  key: 'cropBoxResizable',
                                  value: true,
                                  type: 'switch',
                                },
                                round: {
                                  label: 'Circle Cropping',
                                  key: 'cropper_roundCrop',
                                  value: false,
                                  type: 'switch',
                                  config: {
                                    only: {
                                      label: 'Only circle cropping',
                                      key: 'only',
                                      value: false,
                                      type: 'switch',
                                    },
                                    circle_diameter: {
                                      label: 'Diameter',
                                      key: 'diameter',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                  },
                                },
                              },
                            },
                            'sie-plugin-text_text': {
                              label: 'Text',
                              key: 'text',
                              value: false,
                              type: 'switch',
                              config: {
                                text_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                text_default: {
                                  label: 'Default text',
                                  key: 'default',
                                  value: 'Lorem ipsum sit dolom',
                                  type: 'text',
                                },
                                text_description: {
                                  label: 'Description',
                                  key: 'description',
                                  value: 'Text',
                                  type: 'text',
                                },
                                text_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                text_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                              },
                            },
                            'sie-plugin-image-overlay_image': {
                              label: 'Image Overlay',
                              key: 'image',
                              value: false,
                              type: 'switch',
                              config: {
                                overlay_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                overlay_default: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                overlay_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_fixed: {
                                  label: 'Fixed Position',
                                  key: 'fixed',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_resizable: {
                                  label: 'Fixed Size',
                                  key: 'resizable',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_change: {
                                  label: 'Change Image',
                                  key: 'changable',
                                  value: false,
                                  type: 'switch',
                                },
                              },
                            },
                            'sie-plugin-shapemask_options': {
                              label: 'Shapemask',
                              key: 'shapemask',
                              value: false,
                              type: 'switch',
                              config: {
                                shapemask_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: false,
                                  type: 'switch',
                                },
                                transparencycolor: {
                                  label: 'Fill color',
                                  key: 'transparencyColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                                transparency: {
                                  label: 'Transparency',
                                  key: 'transparency',
                                  value: 1,
                                  max: 1,
                                  min: 0,
                                  step: 0.10000000000000001,
                                  type: 'number',
                                },
                                shapemask_square: {
                                  label: 'Square',
                                  key: 'shapes_square',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    square_width: {
                                      label: 'Width',
                                      key: 'width',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_height: {
                                      label: 'Height',
                                      key: 'height',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Square',
                                    },
                                    square_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-square-o',
                                    },
                                  },
                                },
                                shapemask_circle: {
                                  label: 'Circle',
                                  key: 'shapes_circle',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    circle_radius: {
                                      label: 'Radius',
                                      key: 'radius',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Circle',
                                    },
                                    circle_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-circle-o',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                        mobile: {
                          value: true,
                          config: {
                            library: {
                              value: true,
                              config: {
                                set_images: {
                                  value: 'test',
                                },
                              },
                            },
                            url: {
                              label: 'URL Upload',
                              key: 'url_upload',
                              value: false,
                              type: 'switch',
                            },
                            'sie-size': {
                              label: 'Size',
                              key: 'size',
                              type: 'label',
                              value: true,
                              config: {
                                size_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 260,
                                  type: 'number',
                                  step: 1,
                                },
                                size_auto: {
                                  label: 'Flexible height',
                                  key: 'auto',
                                  value: true,
                                  type: 'switch',
                                },
                                size_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 200,
                                  type: 'number',
                                  step: 1,
                                },
                                size_minHeight: {
                                  label: 'Min. Height',
                                  key: 'minHeight',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                size_fit: {
                                  label: 'Image Fit',
                                  key: 'fit',
                                  value: '2',
                                  type: 'select',
                                  options: [
                                    'Contain',
                                    'Cover',
                                    'Max Size',
                                  ],
                                },
                              },
                            },
                            'sie-plugin-image_upload': {
                              label: 'Upload',
                              key: 'upload',
                              type: 'label',
                              value: true,
                              config: {
                                uploaddefault: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                fillcolor: {
                                  label: 'Background color',
                                  key: 'fillColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                              },
                            },
                            'sie-plugin-image_cropper': {
                              label: 'Cropper',
                              key: 'enable',
                              type: 'switch',
                              value: true,
                              config: {
                                movable: {
                                  label: 'Enable Drag',
                                  key: 'movable',
                                  value: true,
                                  type: 'switch',
                                },
                                rotatable: {
                                  label: 'Enable rotation',
                                  key: 'rotatable',
                                  value: false,
                                  type: 'switch',
                                },
                                zoomable: {
                                  label: 'Enable zoom',
                                  key: 'zoomable',
                                  value: true,
                                  type: 'switch',
                                },
                                vertical: {
                                  label: 'Vertical crop',
                                  key: 'cropBoxResizable',
                                  value: true,
                                  type: 'switch',
                                },
                                round: {
                                  label: 'Circle Cropping',
                                  key: 'cropper_roundCrop',
                                  value: false,
                                  type: 'switch',
                                  config: {
                                    only: {
                                      label: 'Only circle cropping',
                                      key: 'only',
                                      value: false,
                                      type: 'switch',
                                    },
                                    circle_diameter: {
                                      label: 'Diameter',
                                      key: 'diameter',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                  },
                                },
                              },
                            },
                            'sie-plugin-text_text': {
                              label: 'Text',
                              key: 'text',
                              value: false,
                              type: 'switch',
                              config: {
                                text_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                text_default: {
                                  label: 'Default text',
                                  key: 'default',
                                  value: 'Lorem ipsum sit dolom',
                                  type: 'text',
                                },
                                text_description: {
                                  label: 'Description',
                                  key: 'description',
                                  value: 'Text',
                                  type: 'text',
                                },
                                text_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                text_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                              },
                            },
                            'sie-plugin-image-overlay_image': {
                              label: 'Image Overlay',
                              key: 'image',
                              value: false,
                              type: 'switch',
                              config: {
                                overlay_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                overlay_default: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                overlay_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_fixed: {
                                  label: 'Fixed Position',
                                  key: 'fixed',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_resizable: {
                                  label: 'Fixed Size',
                                  key: 'resizable',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_change: {
                                  label: 'Change Image',
                                  key: 'changable',
                                  value: false,
                                  type: 'switch',
                                },
                              },
                            },
                            'sie-plugin-shapemask_options': {
                              label: 'Shapemask',
                              key: 'shapemask',
                              value: false,
                              type: 'switch',
                              config: {
                                shapemask_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: false,
                                  type: 'switch',
                                },
                                transparencycolor: {
                                  label: 'Fill color',
                                  key: 'transparencyColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                                transparency: {
                                  label: 'Transparency',
                                  key: 'transparency',
                                  value: 1,
                                  max: 1,
                                  min: 0,
                                  step: 0.10000000000000001,
                                  type: 'number',
                                },
                                shapemask_square: {
                                  label: 'Square',
                                  key: 'shapes_square',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    square_width: {
                                      label: 'Width',
                                      key: 'width',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_height: {
                                      label: 'Height',
                                      key: 'height',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Square',
                                    },
                                    square_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-square-o',
                                    },
                                  },
                                },
                                shapemask_circle: {
                                  label: 'Circle',
                                  key: 'shapes_circle',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    circle_radius: {
                                      label: 'Radius',
                                      key: 'radius',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Circle',
                                    },
                                    circle_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-circle-o',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      image1: {
                        destinationUrl: '#',
                        alt: '',
                        desktop: {
                          value: true,
                          config: {
                            library: {
                              value: true,
                              config: {
                                set_images: {
                                  value: 'test',
                                },
                              },
                            },
                            url: {
                              label: 'URL Upload',
                              key: 'url_upload',
                              value: false,
                              type: 'switch',
                            },
                            'sie-size': {
                              label: 'Size',
                              key: 'size',
                              type: 'label',
                              value: true,
                              config: {
                                size_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 260,
                                  type: 'number',
                                  step: 1,
                                },
                                size_auto: {
                                  label: 'Flexible height',
                                  key: 'auto',
                                  value: true,
                                  type: 'switch',
                                },
                                size_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 200,
                                  type: 'number',
                                  step: 1,
                                },
                                size_minHeight: {
                                  label: 'Min. Height',
                                  key: 'minHeight',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                size_fit: {
                                  label: 'Image Fit',
                                  key: 'fit',
                                  value: '2',
                                  type: 'select',
                                  options: [
                                    'Contain',
                                    'Cover',
                                    'Max Size',
                                  ],
                                },
                              },
                            },
                            'sie-plugin-image_upload': {
                              label: 'Upload',
                              key: 'upload',
                              type: 'label',
                              value: true,
                              config: {
                                uploaddefault: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                fillcolor: {
                                  label: 'Background color',
                                  key: 'fillColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                              },
                            },
                            'sie-plugin-image_cropper': {
                              label: 'Cropper',
                              key: 'enable',
                              type: 'switch',
                              value: true,
                              config: {
                                movable: {
                                  label: 'Enable Drag',
                                  key: 'movable',
                                  value: true,
                                  type: 'switch',
                                },
                                rotatable: {
                                  label: 'Enable rotation',
                                  key: 'rotatable',
                                  value: false,
                                  type: 'switch',
                                },
                                zoomable: {
                                  label: 'Enable zoom',
                                  key: 'zoomable',
                                  value: true,
                                  type: 'switch',
                                },
                                vertical: {
                                  label: 'Vertical crop',
                                  key: 'cropBoxResizable',
                                  value: true,
                                  type: 'switch',
                                },
                                round: {
                                  label: 'Circle Cropping',
                                  key: 'cropper_roundCrop',
                                  value: false,
                                  type: 'switch',
                                  config: {
                                    only: {
                                      label: 'Only circle cropping',
                                      key: 'only',
                                      value: false,
                                      type: 'switch',
                                    },
                                    circle_diameter: {
                                      label: 'Diameter',
                                      key: 'diameter',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                  },
                                },
                              },
                            },
                            'sie-plugin-text_text': {
                              label: 'Text',
                              key: 'text',
                              value: false,
                              type: 'switch',
                              config: {
                                text_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                text_default: {
                                  label: 'Default text',
                                  key: 'default',
                                  value: 'Lorem ipsum sit dolom',
                                  type: 'text',
                                },
                                text_description: {
                                  label: 'Description',
                                  key: 'description',
                                  value: 'Text',
                                  type: 'text',
                                },
                                text_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                text_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                              },
                            },
                            'sie-plugin-image-overlay_image': {
                              label: 'Image Overlay',
                              key: 'image',
                              value: false,
                              type: 'switch',
                              config: {
                                overlay_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                overlay_default: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                overlay_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_fixed: {
                                  label: 'Fixed Position',
                                  key: 'fixed',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_resizable: {
                                  label: 'Fixed Size',
                                  key: 'resizable',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_change: {
                                  label: 'Change Image',
                                  key: 'changable',
                                  value: false,
                                  type: 'switch',
                                },
                              },
                            },
                            'sie-plugin-shapemask_options': {
                              label: 'Shapemask',
                              key: 'shapemask',
                              value: false,
                              type: 'switch',
                              config: {
                                shapemask_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: false,
                                  type: 'switch',
                                },
                                transparencycolor: {
                                  label: 'Fill color',
                                  key: 'transparencyColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                                transparency: {
                                  label: 'Transparency',
                                  key: 'transparency',
                                  value: 1,
                                  max: 1,
                                  min: 0,
                                  step: 0.10000000000000001,
                                  type: 'number',
                                },
                                shapemask_square: {
                                  label: 'Square',
                                  key: 'shapes_square',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    square_width: {
                                      label: 'Width',
                                      key: 'width',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_height: {
                                      label: 'Height',
                                      key: 'height',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Square',
                                    },
                                    square_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-square-o',
                                    },
                                  },
                                },
                                shapemask_circle: {
                                  label: 'Circle',
                                  key: 'shapes_circle',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    circle_radius: {
                                      label: 'Radius',
                                      key: 'radius',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Circle',
                                    },
                                    circle_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-circle-o',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                        mobile: {
                          value: true,
                          config: {
                            library: {
                              value: true,
                              config: {
                                set_images: {
                                  value: 'test',
                                },
                              },
                            },
                            url: {
                              label: 'URL Upload',
                              key: 'url_upload',
                              value: false,
                              type: 'switch',
                            },
                            'sie-size': {
                              label: 'Size',
                              key: 'size',
                              type: 'label',
                              value: true,
                              config: {
                                size_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 260,
                                  type: 'number',
                                  step: 1,
                                },
                                size_auto: {
                                  label: 'Flexible height',
                                  key: 'auto',
                                  value: true,
                                  type: 'switch',
                                },
                                size_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 200,
                                  type: 'number',
                                  step: 1,
                                },
                                size_minHeight: {
                                  label: 'Min. Height',
                                  key: 'minHeight',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                size_fit: {
                                  label: 'Image Fit',
                                  key: 'fit',
                                  value: '2',
                                  type: 'select',
                                  options: [
                                    'Contain',
                                    'Cover',
                                    'Max Size',
                                  ],
                                },
                              },
                            },
                            'sie-plugin-image_upload': {
                              label: 'Upload',
                              key: 'upload',
                              type: 'label',
                              value: true,
                              config: {
                                uploaddefault: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                fillcolor: {
                                  label: 'Background color',
                                  key: 'fillColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                              },
                            },
                            'sie-plugin-image_cropper': {
                              label: 'Cropper',
                              key: 'enable',
                              type: 'switch',
                              value: true,
                              config: {
                                movable: {
                                  label: 'Enable Drag',
                                  key: 'movable',
                                  value: true,
                                  type: 'switch',
                                },
                                rotatable: {
                                  label: 'Enable rotation',
                                  key: 'rotatable',
                                  value: false,
                                  type: 'switch',
                                },
                                zoomable: {
                                  label: 'Enable zoom',
                                  key: 'zoomable',
                                  value: true,
                                  type: 'switch',
                                },
                                vertical: {
                                  label: 'Vertical crop',
                                  key: 'cropBoxResizable',
                                  value: true,
                                  type: 'switch',
                                },
                                round: {
                                  label: 'Circle Cropping',
                                  key: 'cropper_roundCrop',
                                  value: false,
                                  type: 'switch',
                                  config: {
                                    only: {
                                      label: 'Only circle cropping',
                                      key: 'only',
                                      value: false,
                                      type: 'switch',
                                    },
                                    circle_diameter: {
                                      label: 'Diameter',
                                      key: 'diameter',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                  },
                                },
                              },
                            },
                            'sie-plugin-text_text': {
                              label: 'Text',
                              key: 'text',
                              value: false,
                              type: 'switch',
                              config: {
                                text_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                text_default: {
                                  label: 'Default text',
                                  key: 'default',
                                  value: 'Lorem ipsum sit dolom',
                                  type: 'text',
                                },
                                text_description: {
                                  label: 'Description',
                                  key: 'description',
                                  value: 'Text',
                                  type: 'text',
                                },
                                text_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                text_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                              },
                            },
                            'sie-plugin-image-overlay_image': {
                              label: 'Image Overlay',
                              key: 'image',
                              value: false,
                              type: 'switch',
                              config: {
                                overlay_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: true,
                                  type: 'switch',
                                },
                                overlay_default: {
                                  label: 'Default image',
                                  key: 'url',
                                  value: '',
                                  type: 'text',
                                },
                                overlay_width: {
                                  label: 'Width',
                                  key: 'width',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_height: {
                                  label: 'Height',
                                  key: 'height',
                                  value: 100,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_top: {
                                  label: 'Top',
                                  key: 'top',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_left: {
                                  label: 'Left',
                                  key: 'left',
                                  value: 0,
                                  type: 'number',
                                  step: 1,
                                },
                                overlay_fixed: {
                                  label: 'Fixed Position',
                                  key: 'fixed',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_resizable: {
                                  label: 'Fixed Size',
                                  key: 'resizable',
                                  value: false,
                                  type: 'switch',
                                },
                                overlay_change: {
                                  label: 'Change Image',
                                  key: 'changable',
                                  value: false,
                                  type: 'switch',
                                },
                              },
                            },
                            'sie-plugin-shapemask_options': {
                              label: 'Shapemask',
                              key: 'shapemask',
                              value: false,
                              type: 'switch',
                              config: {
                                shapemask_visible: {
                                  label: 'Visible',
                                  key: 'visible',
                                  value: false,
                                  type: 'switch',
                                },
                                transparencycolor: {
                                  label: 'Fill color',
                                  key: 'transparencyColor',
                                  value: '#000000',
                                  type: 'text',
                                },
                                transparency: {
                                  label: 'Transparency',
                                  key: 'transparency',
                                  value: 1,
                                  max: 1,
                                  min: 0,
                                  step: 0.10000000000000001,
                                  type: 'number',
                                },
                                shapemask_square: {
                                  label: 'Square',
                                  key: 'shapes_square',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    square_width: {
                                      label: 'Width',
                                      key: 'width',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_height: {
                                      label: 'Height',
                                      key: 'height',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    square_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Square',
                                    },
                                    square_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-square-o',
                                    },
                                  },
                                },
                                shapemask_circle: {
                                  label: 'Circle',
                                  key: 'shapes_circle',
                                  type: 'switch',
                                  value: false,
                                  config: {
                                    circle_radius: {
                                      label: 'Radius',
                                      key: 'radius',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_top: {
                                      label: 'Top',
                                      key: 'top',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_left: {
                                      label: 'Left',
                                      key: 'left',
                                      value: 0,
                                      type: 'number',
                                      step: 1,
                                    },
                                    circle_description: {
                                      label: 'Description',
                                      key: 'description',
                                      type: 'text',
                                      value: 'Circle',
                                    },
                                    circle_icon: {
                                      label: 'Icon',
                                      key: 'icon',
                                      type: 'text',
                                      value: 'fa fa-circle-o',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    validation: {
                      image0: {
                        destinationUrl: {
                          option: 'required|url:true',
                          parseUrl: true,
                        },
                        alt: {
                          option: 'required:true',
                        },
                      },
                      image1: {
                        destinationUrl: {
                          option: 'required|url:true',
                          parseUrl: true,
                        },
                        alt: {
                          option: 'required:true',
                        },
                      },
                    },
                  },
                  data: {
                    optionValue: 'option1',
                  },
                  enabled: true,
                  settings: true,
                  isFixed: true,
                  fixedPosition: 0,
                  idInstance: 799228,
                },
              ],
              body_html: '',
              plain_text: '',
              processed: 0,
              status: 1,
              library: '5ace412ea6ddbe0c000c513a',
              cdn_path: 'wfxi04cq8k',
              created_by: {
                id: {
                  $oid: '5af9c6f7de88c7005c46a1f2',
                },
                email: 'federico.rodriguez@stensul.com',
              },
              updated_by: {
                id: {
                  $oid: '5af9c6f7de88c7005c46a1f2',
                },
                email: 'federico.rodriguez@stensul.com',
              },
              deleted_by: [

              ],
              favorite_by: [

              ],
              locked_by: null,
              email_sent_history: [

              ],
              campaign_preheader: '',
              tags: [

              ],
              template: false,
              locked: false,
              favorite: false,
              campaign_settings: [

              ],
              auto_save: true,
              parent_campaign_id: null,
              proof_id: null,
              library_name: 'Gartner Catalyst Conference',
              updated_at: '2018-05-22 14:11:37',
              created_at: '2018-05-22 14:01:35',
              campaign_fonts: {
                system: [
                  'Helvetica',
                  'Arial',
                  'Sans-serif',
                ],
                web: [
                  'Open Sans',
                ],
                custom: [

                ],
              },
              isFavorite: false,
              api: [
                {
                  driver: 'eloqua',
                  title: 'Eloqua',
                  class: 'Eloqua',
                },
              ],
              library_config: {
                templateWidth: 600,
                templateMobileWidth: 320,
                templateBackgroundColor: '#FFFFFF',
                contentBackgroundColor: '#FFFFFF',
                fontFamily: 'Arial, Helvetica, Sans-serif',
                fontSize: 14,
                fontColor: '#000000',
                lineHeight: 18,
                linkColor: '#006699',
                linkDecoration: 'none',
                externalCssLink: '',
                propietaryCss: '',
                fixedModules: '[{"key":"header", "pos":0},{"key":"footer_gartner_catalyst", "pos":-1}]',
                padding: 0,
                esp: true,
                espProvider: 'eloqua',
                plainText: true,
                preheader: false,
                tagging: true,
                templating: true,
              },
              uploads: [

              ],
              can_be_processed: true,
              has_active_proof: false,
              proof_token: '',
            },
            library_config: {
              templateWidth: 800,
              templateMobileWidth: 320,
              templateBackgroundColor: '#FFFFFF',
              contentBackgroundColor: '#FFFFFF',
              fontFamily: 'Arial, Helvetica, Sans-serif',
              fontSize: 14,
              fontColor: '#000000',
              lineHeight: 18,
              linkColor: '#006699',
              linkDecoration: 'none',
              externalCssLink: '',
              propietaryCss: '',
              fixedModules: '[{"key":"header", "pos":0},{"key":"footer_gartner_catalyst", "pos":-1}]',
              padding: 0,
              esp: true,
              espProvider: 'eloqua',
              plainText: true,
              preheader: false,
              tagging: true,
              templating: true,
              key: 'gartner_catalyst_conference',
            },
            tag_list: [
              {
                _id: '5ad79340a72464000f7ceacb',
                name: 'test',
                updated_at: '2018-04-18 14:49:36',
                created_at: '2018-04-18 14:49:36',
              },
              {
                _id: '5ad8c792a72464007644f665',
                name: 'gab',
                updated_at: '2018-04-19 12:45:06',
                created_at: '2018-04-19 12:45:06',
              },
              {
                _id: '5af1e04f774ef300493c4e0e',
                name: 'pepe',
                updated_at: '2018-05-08 13:37:19',
                created_at: '2018-05-08 13:37:19',
              },
              {
                _id: '5af5e2c546820300183cee42',
                name: 'final_test',
                updated_at: '2018-05-11 14:36:53',
                created_at: '2018-05-11 14:36:53',
              },
              {
                _id: '5afb17f709d045000e6315dc',
                name: 'qa',
                updated_at: '2018-05-15 13:25:11',
                created_at: '2018-05-15 13:25:11',
              },
              {
                _id: '5aff1423ee10e500157d1306',
                name: 'quemiras',
                updated_at: '2018-05-18 13:57:55',
                created_at: '2018-05-18 13:57:55',
              },
              {
                _id: '5b03026adbd940001205b890',
                name: 'gabito',
                updated_at: '2018-05-21 13:31:22',
                created_at: '2018-05-21 13:31:22',
              },
            ],
            header_title: 'Campaign Editor',
          },
          modules: [{
            key: 'header',
            name: 'Event Name/Date/Location/Logo ',
            title: 'Event Name/Date/Location/Logo',
            version: '0.0.1',
            author: 'matias@stensul.com',
            type: 'custom',
            params: {
              linkColor: '#006699',
              colors: {
                default: [
                  '000000',
                  'Black',
                ],
                gartner: [
                  '006699',
                  'Dark Blue',
                ],
                cios_senior_it_executives: [
                  '00457C',
                  'Dark Blue',
                ],
                applications: [
                  'E31836',
                  'Red',
                ],
                'data_&_analytics': [
                  'EE9A00',
                  'Orange',
                ],
                'enterprise_architecture_&_technology_innovation': [
                  '5A447A',
                  'Purple',
                ],
                'infrastructure_&_operations': [
                  '34B233',
                  'Green',
                ],
                'program_&_portfolio_management': [
                  'AF006E',
                  'Dark Pink',
                ],
                'security_&_risk_management': [
                  'C75B12',
                  'Dark Orange',
                ],
                'sourcing_&_vendor_relationships': [
                  '00A8B4',
                  'Light Blue',
                ],
                gartner_catalyst_conference: [
                  'EF4836',
                  'Red',
                ],
                gartner_digital_marketing_conference: [
                  '00ADEF',
                  'Light Blue',
                ],
                gartner_supply_chain_conference: [
                  'B6BE28',
                  'Gold',
                  '006699',
                  'Dark Blue',
                ],
                'gartner_tech_growth_&_innovation_conference': [
                  '66BE28',
                  'Green',
                ],
                symposium: [
                  '13233b',
                  'Blue',
                ],
              },
              preheader: '100 characters with spaces max Main CTA here dis enit et quamet as sunt int link text here.',
              options: {
                option1: {
                  optionValue: 'option1',
                  label: 'Stack right image on top',
                },
                option2: {
                  optionValue: 'option2',
                  label: 'Stack left image on top',
                },
                option3: {
                  optionValue: 'option3',
                  label: 'Hide the right side image',
                },
                option4: {
                  optionValue: 'option4',
                  label: 'Place the right side image at the bottom of the email',
                },
              },
              images: {
                image0: {
                  destinationUrl: '#',
                  alt: '',
                  desktop: {
                    value: true,
                    config: {
                      library: {
                        value: true,
                        config: {
                          set_images: {
                            value: 'test',
                          },
                        },
                      },
                      url: {
                        label: 'URL Upload',
                        key: 'url_upload',
                        value: false,
                        type: 'switch',
                      },
                      'sie-size': {
                        label: 'Size',
                        key: 'size',
                        type: 'label',
                        value: true,
                        config: {
                          size_width: {
                            label: 'Width',
                            key: 'width',
                            value: 260,
                            type: 'number',
                            step: 1,
                          },
                          size_auto: {
                            label: 'Flexible height',
                            key: 'auto',
                            value: true,
                            type: 'switch',
                          },
                          size_height: {
                            label: 'Height',
                            key: 'height',
                            value: 200,
                            type: 'number',
                            step: 1,
                          },
                          size_minHeight: {
                            label: 'Min. Height',
                            key: 'minHeight',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          size_fit: {
                            label: 'Image Fit',
                            key: 'fit',
                            value: '2',
                            type: 'select',
                            options: [
                              'Contain',
                              'Cover',
                              'Max Size',
                            ],
                          },
                        },
                      },
                      'sie-plugin-image_upload': {
                        label: 'Upload',
                        key: 'upload',
                        type: 'label',
                        value: true,
                        config: {
                          uploaddefault: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          fillcolor: {
                            label: 'Background color',
                            key: 'fillColor',
                            value: '#000000',
                            type: 'text',
                          },
                        },
                      },
                      'sie-plugin-image_cropper': {
                        label: 'Cropper',
                        key: 'enable',
                        type: 'switch',
                        value: true,
                        config: {
                          movable: {
                            label: 'Enable Drag',
                            key: 'movable',
                            value: true,
                            type: 'switch',
                          },
                          rotatable: {
                            label: 'Enable rotation',
                            key: 'rotatable',
                            value: false,
                            type: 'switch',
                          },
                          zoomable: {
                            label: 'Enable zoom',
                            key: 'zoomable',
                            value: true,
                            type: 'switch',
                          },
                          vertical: {
                            label: 'Vertical crop',
                            key: 'cropBoxResizable',
                            value: true,
                            type: 'switch',
                          },
                          round: {
                            label: 'Circle Cropping',
                            key: 'cropper_roundCrop',
                            value: false,
                            type: 'switch',
                            config: {
                              only: {
                                label: 'Only circle cropping',
                                key: 'only',
                                value: false,
                                type: 'switch',
                              },
                              circle_diameter: {
                                label: 'Diameter',
                                key: 'diameter',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                            },
                          },
                        },
                      },
                      'sie-plugin-text_text': {
                        label: 'Text',
                        key: 'text',
                        value: false,
                        type: 'switch',
                        config: {
                          text_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          text_default: {
                            label: 'Default text',
                            key: 'default',
                            value: 'Lorem ipsum sit dolom',
                            type: 'text',
                          },
                          text_description: {
                            label: 'Description',
                            key: 'description',
                            value: 'Text',
                            type: 'text',
                          },
                          text_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          text_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                        },
                      },
                      'sie-plugin-image-overlay_image': {
                        label: 'Image Overlay',
                        key: 'image',
                        value: false,
                        type: 'switch',
                        config: {
                          overlay_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          overlay_default: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          overlay_width: {
                            label: 'Width',
                            key: 'width',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_height: {
                            label: 'Height',
                            key: 'height',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_fixed: {
                            label: 'Fixed Position',
                            key: 'fixed',
                            value: false,
                            type: 'switch',
                          },
                          overlay_resizable: {
                            label: 'Fixed Size',
                            key: 'resizable',
                            value: false,
                            type: 'switch',
                          },
                          overlay_change: {
                            label: 'Change Image',
                            key: 'changable',
                            value: false,
                            type: 'switch',
                          },
                        },
                      },
                      'sie-plugin-shapemask_options': {
                        label: 'Shapemask',
                        key: 'shapemask',
                        value: false,
                        type: 'switch',
                        config: {
                          shapemask_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: false,
                            type: 'switch',
                          },
                          transparencycolor: {
                            label: 'Fill color',
                            key: 'transparencyColor',
                            value: '#000000',
                            type: 'text',
                          },
                          transparency: {
                            label: 'Transparency',
                            key: 'transparency',
                            value: 1,
                            max: 1,
                            min: 0,
                            step: 0.10000000000000001,
                            type: 'number',
                          },
                          shapemask_square: {
                            label: 'Square',
                            key: 'shapes_square',
                            type: 'switch',
                            value: false,
                            config: {
                              square_width: {
                                label: 'Width',
                                key: 'width',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_height: {
                                label: 'Height',
                                key: 'height',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Square',
                              },
                              square_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-square-o',
                              },
                            },
                          },
                          shapemask_circle: {
                            label: 'Circle',
                            key: 'shapes_circle',
                            type: 'switch',
                            value: false,
                            config: {
                              circle_radius: {
                                label: 'Radius',
                                key: 'radius',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Circle',
                              },
                              circle_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-circle-o',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  mobile: {
                    value: true,
                    config: {
                      library: {
                        value: true,
                        config: {
                          set_images: {
                            value: 'test',
                          },
                        },
                      },
                      url: {
                        label: 'URL Upload',
                        key: 'url_upload',
                        value: false,
                        type: 'switch',
                      },
                      'sie-size': {
                        label: 'Size',
                        key: 'size',
                        type: 'label',
                        value: true,
                        config: {
                          size_width: {
                            label: 'Width',
                            key: 'width',
                            value: 260,
                            type: 'number',
                            step: 1,
                          },
                          size_auto: {
                            label: 'Flexible height',
                            key: 'auto',
                            value: true,
                            type: 'switch',
                          },
                          size_height: {
                            label: 'Height',
                            key: 'height',
                            value: 200,
                            type: 'number',
                            step: 1,
                          },
                          size_minHeight: {
                            label: 'Min. Height',
                            key: 'minHeight',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          size_fit: {
                            label: 'Image Fit',
                            key: 'fit',
                            value: '2',
                            type: 'select',
                            options: [
                              'Contain',
                              'Cover',
                              'Max Size',
                            ],
                          },
                        },
                      },
                      'sie-plugin-image_upload': {
                        label: 'Upload',
                        key: 'upload',
                        type: 'label',
                        value: true,
                        config: {
                          uploaddefault: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          fillcolor: {
                            label: 'Background color',
                            key: 'fillColor',
                            value: '#000000',
                            type: 'text',
                          },
                        },
                      },
                      'sie-plugin-image_cropper': {
                        label: 'Cropper',
                        key: 'enable',
                        type: 'switch',
                        value: true,
                        config: {
                          movable: {
                            label: 'Enable Drag',
                            key: 'movable',
                            value: true,
                            type: 'switch',
                          },
                          rotatable: {
                            label: 'Enable rotation',
                            key: 'rotatable',
                            value: false,
                            type: 'switch',
                          },
                          zoomable: {
                            label: 'Enable zoom',
                            key: 'zoomable',
                            value: true,
                            type: 'switch',
                          },
                          vertical: {
                            label: 'Vertical crop',
                            key: 'cropBoxResizable',
                            value: true,
                            type: 'switch',
                          },
                          round: {
                            label: 'Circle Cropping',
                            key: 'cropper_roundCrop',
                            value: false,
                            type: 'switch',
                            config: {
                              only: {
                                label: 'Only circle cropping',
                                key: 'only',
                                value: false,
                                type: 'switch',
                              },
                              circle_diameter: {
                                label: 'Diameter',
                                key: 'diameter',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                            },
                          },
                        },
                      },
                      'sie-plugin-text_text': {
                        label: 'Text',
                        key: 'text',
                        value: false,
                        type: 'switch',
                        config: {
                          text_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          text_default: {
                            label: 'Default text',
                            key: 'default',
                            value: 'Lorem ipsum sit dolom',
                            type: 'text',
                          },
                          text_description: {
                            label: 'Description',
                            key: 'description',
                            value: 'Text',
                            type: 'text',
                          },
                          text_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          text_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                        },
                      },
                      'sie-plugin-image-overlay_image': {
                        label: 'Image Overlay',
                        key: 'image',
                        value: false,
                        type: 'switch',
                        config: {
                          overlay_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          overlay_default: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          overlay_width: {
                            label: 'Width',
                            key: 'width',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_height: {
                            label: 'Height',
                            key: 'height',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_fixed: {
                            label: 'Fixed Position',
                            key: 'fixed',
                            value: false,
                            type: 'switch',
                          },
                          overlay_resizable: {
                            label: 'Fixed Size',
                            key: 'resizable',
                            value: false,
                            type: 'switch',
                          },
                          overlay_change: {
                            label: 'Change Image',
                            key: 'changable',
                            value: false,
                            type: 'switch',
                          },
                        },
                      },
                      'sie-plugin-shapemask_options': {
                        label: 'Shapemask',
                        key: 'shapemask',
                        value: false,
                        type: 'switch',
                        config: {
                          shapemask_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: false,
                            type: 'switch',
                          },
                          transparencycolor: {
                            label: 'Fill color',
                            key: 'transparencyColor',
                            value: '#000000',
                            type: 'text',
                          },
                          transparency: {
                            label: 'Transparency',
                            key: 'transparency',
                            value: 1,
                            max: 1,
                            min: 0,
                            step: 0.10000000000000001,
                            type: 'number',
                          },
                          shapemask_square: {
                            label: 'Square',
                            key: 'shapes_square',
                            type: 'switch',
                            value: false,
                            config: {
                              square_width: {
                                label: 'Width',
                                key: 'width',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_height: {
                                label: 'Height',
                                key: 'height',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Square',
                              },
                              square_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-square-o',
                              },
                            },
                          },
                          shapemask_circle: {
                            label: 'Circle',
                            key: 'shapes_circle',
                            type: 'switch',
                            value: false,
                            config: {
                              circle_radius: {
                                label: 'Radius',
                                key: 'radius',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Circle',
                              },
                              circle_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-circle-o',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                image1: {
                  destinationUrl: '#',
                  alt: '',
                  desktop: {
                    value: true,
                    config: {
                      library: {
                        value: true,
                        config: {
                          set_images: {
                            value: 'test',
                          },
                        },
                      },
                      url: {
                        label: 'URL Upload',
                        key: 'url_upload',
                        value: false,
                        type: 'switch',
                      },
                      'sie-size': {
                        label: 'Size',
                        key: 'size',
                        type: 'label',
                        value: true,
                        config: {
                          size_width: {
                            label: 'Width',
                            key: 'width',
                            value: 260,
                            type: 'number',
                            step: 1,
                          },
                          size_auto: {
                            label: 'Flexible height',
                            key: 'auto',
                            value: true,
                            type: 'switch',
                          },
                          size_height: {
                            label: 'Height',
                            key: 'height',
                            value: 200,
                            type: 'number',
                            step: 1,
                          },
                          size_minHeight: {
                            label: 'Min. Height',
                            key: 'minHeight',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          size_fit: {
                            label: 'Image Fit',
                            key: 'fit',
                            value: '2',
                            type: 'select',
                            options: [
                              'Contain',
                              'Cover',
                              'Max Size',
                            ],
                          },
                        },
                      },
                      'sie-plugin-image_upload': {
                        label: 'Upload',
                        key: 'upload',
                        type: 'label',
                        value: true,
                        config: {
                          uploaddefault: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          fillcolor: {
                            label: 'Background color',
                            key: 'fillColor',
                            value: '#000000',
                            type: 'text',
                          },
                        },
                      },
                      'sie-plugin-image_cropper': {
                        label: 'Cropper',
                        key: 'enable',
                        type: 'switch',
                        value: true,
                        config: {
                          movable: {
                            label: 'Enable Drag',
                            key: 'movable',
                            value: true,
                            type: 'switch',
                          },
                          rotatable: {
                            label: 'Enable rotation',
                            key: 'rotatable',
                            value: false,
                            type: 'switch',
                          },
                          zoomable: {
                            label: 'Enable zoom',
                            key: 'zoomable',
                            value: true,
                            type: 'switch',
                          },
                          vertical: {
                            label: 'Vertical crop',
                            key: 'cropBoxResizable',
                            value: true,
                            type: 'switch',
                          },
                          round: {
                            label: 'Circle Cropping',
                            key: 'cropper_roundCrop',
                            value: false,
                            type: 'switch',
                            config: {
                              only: {
                                label: 'Only circle cropping',
                                key: 'only',
                                value: false,
                                type: 'switch',
                              },
                              circle_diameter: {
                                label: 'Diameter',
                                key: 'diameter',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                            },
                          },
                        },
                      },
                      'sie-plugin-text_text': {
                        label: 'Text',
                        key: 'text',
                        value: false,
                        type: 'switch',
                        config: {
                          text_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          text_default: {
                            label: 'Default text',
                            key: 'default',
                            value: 'Lorem ipsum sit dolom',
                            type: 'text',
                          },
                          text_description: {
                            label: 'Description',
                            key: 'description',
                            value: 'Text',
                            type: 'text',
                          },
                          text_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          text_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                        },
                      },
                      'sie-plugin-image-overlay_image': {
                        label: 'Image Overlay',
                        key: 'image',
                        value: false,
                        type: 'switch',
                        config: {
                          overlay_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          overlay_default: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          overlay_width: {
                            label: 'Width',
                            key: 'width',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_height: {
                            label: 'Height',
                            key: 'height',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_fixed: {
                            label: 'Fixed Position',
                            key: 'fixed',
                            value: false,
                            type: 'switch',
                          },
                          overlay_resizable: {
                            label: 'Fixed Size',
                            key: 'resizable',
                            value: false,
                            type: 'switch',
                          },
                          overlay_change: {
                            label: 'Change Image',
                            key: 'changable',
                            value: false,
                            type: 'switch',
                          },
                        },
                      },
                      'sie-plugin-shapemask_options': {
                        label: 'Shapemask',
                        key: 'shapemask',
                        value: false,
                        type: 'switch',
                        config: {
                          shapemask_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: false,
                            type: 'switch',
                          },
                          transparencycolor: {
                            label: 'Fill color',
                            key: 'transparencyColor',
                            value: '#000000',
                            type: 'text',
                          },
                          transparency: {
                            label: 'Transparency',
                            key: 'transparency',
                            value: 1,
                            max: 1,
                            min: 0,
                            step: 0.10000000000000001,
                            type: 'number',
                          },
                          shapemask_square: {
                            label: 'Square',
                            key: 'shapes_square',
                            type: 'switch',
                            value: false,
                            config: {
                              square_width: {
                                label: 'Width',
                                key: 'width',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_height: {
                                label: 'Height',
                                key: 'height',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Square',
                              },
                              square_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-square-o',
                              },
                            },
                          },
                          shapemask_circle: {
                            label: 'Circle',
                            key: 'shapes_circle',
                            type: 'switch',
                            value: false,
                            config: {
                              circle_radius: {
                                label: 'Radius',
                                key: 'radius',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Circle',
                              },
                              circle_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-circle-o',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  mobile: {
                    value: true,
                    config: {
                      library: {
                        value: true,
                        config: {
                          set_images: {
                            value: 'test',
                          },
                        },
                      },
                      url: {
                        label: 'URL Upload',
                        key: 'url_upload',
                        value: false,
                        type: 'switch',
                      },
                      'sie-size': {
                        label: 'Size',
                        key: 'size',
                        type: 'label',
                        value: true,
                        config: {
                          size_width: {
                            label: 'Width',
                            key: 'width',
                            value: 260,
                            type: 'number',
                            step: 1,
                          },
                          size_auto: {
                            label: 'Flexible height',
                            key: 'auto',
                            value: true,
                            type: 'switch',
                          },
                          size_height: {
                            label: 'Height',
                            key: 'height',
                            value: 200,
                            type: 'number',
                            step: 1,
                          },
                          size_minHeight: {
                            label: 'Min. Height',
                            key: 'minHeight',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          size_fit: {
                            label: 'Image Fit',
                            key: 'fit',
                            value: '2',
                            type: 'select',
                            options: [
                              'Contain',
                              'Cover',
                              'Max Size',
                            ],
                          },
                        },
                      },
                      'sie-plugin-image_upload': {
                        label: 'Upload',
                        key: 'upload',
                        type: 'label',
                        value: true,
                        config: {
                          uploaddefault: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          fillcolor: {
                            label: 'Background color',
                            key: 'fillColor',
                            value: '#000000',
                            type: 'text',
                          },
                        },
                      },
                      'sie-plugin-image_cropper': {
                        label: 'Cropper',
                        key: 'enable',
                        type: 'switch',
                        value: true,
                        config: {
                          movable: {
                            label: 'Enable Drag',
                            key: 'movable',
                            value: true,
                            type: 'switch',
                          },
                          rotatable: {
                            label: 'Enable rotation',
                            key: 'rotatable',
                            value: false,
                            type: 'switch',
                          },
                          zoomable: {
                            label: 'Enable zoom',
                            key: 'zoomable',
                            value: true,
                            type: 'switch',
                          },
                          vertical: {
                            label: 'Vertical crop',
                            key: 'cropBoxResizable',
                            value: true,
                            type: 'switch',
                          },
                          round: {
                            label: 'Circle Cropping',
                            key: 'cropper_roundCrop',
                            value: false,
                            type: 'switch',
                            config: {
                              only: {
                                label: 'Only circle cropping',
                                key: 'only',
                                value: false,
                                type: 'switch',
                              },
                              circle_diameter: {
                                label: 'Diameter',
                                key: 'diameter',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                            },
                          },
                        },
                      },
                      'sie-plugin-text_text': {
                        label: 'Text',
                        key: 'text',
                        value: false,
                        type: 'switch',
                        config: {
                          text_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          text_default: {
                            label: 'Default text',
                            key: 'default',
                            value: 'Lorem ipsum sit dolom',
                            type: 'text',
                          },
                          text_description: {
                            label: 'Description',
                            key: 'description',
                            value: 'Text',
                            type: 'text',
                          },
                          text_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          text_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                        },
                      },
                      'sie-plugin-image-overlay_image': {
                        label: 'Image Overlay',
                        key: 'image',
                        value: false,
                        type: 'switch',
                        config: {
                          overlay_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: true,
                            type: 'switch',
                          },
                          overlay_default: {
                            label: 'Default image',
                            key: 'url',
                            value: '',
                            type: 'text',
                          },
                          overlay_width: {
                            label: 'Width',
                            key: 'width',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_height: {
                            label: 'Height',
                            key: 'height',
                            value: 100,
                            type: 'number',
                            step: 1,
                          },
                          overlay_top: {
                            label: 'Top',
                            key: 'top',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_left: {
                            label: 'Left',
                            key: 'left',
                            value: 0,
                            type: 'number',
                            step: 1,
                          },
                          overlay_fixed: {
                            label: 'Fixed Position',
                            key: 'fixed',
                            value: false,
                            type: 'switch',
                          },
                          overlay_resizable: {
                            label: 'Fixed Size',
                            key: 'resizable',
                            value: false,
                            type: 'switch',
                          },
                          overlay_change: {
                            label: 'Change Image',
                            key: 'changable',
                            value: false,
                            type: 'switch',
                          },
                        },
                      },
                      'sie-plugin-shapemask_options': {
                        label: 'Shapemask',
                        key: 'shapemask',
                        value: false,
                        type: 'switch',
                        config: {
                          shapemask_visible: {
                            label: 'Visible',
                            key: 'visible',
                            value: false,
                            type: 'switch',
                          },
                          transparencycolor: {
                            label: 'Fill color',
                            key: 'transparencyColor',
                            value: '#000000',
                            type: 'text',
                          },
                          transparency: {
                            label: 'Transparency',
                            key: 'transparency',
                            value: 1,
                            max: 1,
                            min: 0,
                            step: 0.10000000000000001,
                            type: 'number',
                          },
                          shapemask_square: {
                            label: 'Square',
                            key: 'shapes_square',
                            type: 'switch',
                            value: false,
                            config: {
                              square_width: {
                                label: 'Width',
                                key: 'width',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_height: {
                                label: 'Height',
                                key: 'height',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              square_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Square',
                              },
                              square_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-square-o',
                              },
                            },
                          },
                          shapemask_circle: {
                            label: 'Circle',
                            key: 'shapes_circle',
                            type: 'switch',
                            value: false,
                            config: {
                              circle_radius: {
                                label: 'Radius',
                                key: 'radius',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_top: {
                                label: 'Top',
                                key: 'top',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_left: {
                                label: 'Left',
                                key: 'left',
                                value: 0,
                                type: 'number',
                                step: 1,
                              },
                              circle_description: {
                                label: 'Description',
                                key: 'description',
                                type: 'text',
                                value: 'Circle',
                              },
                              circle_icon: {
                                label: 'Icon',
                                key: 'icon',
                                type: 'text',
                                value: 'fa fa-circle-o',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              validation: {
                image0: {
                  destinationUrl: {
                    option: 'required|url:true',
                    parseUrl: true,
                  },
                  alt: {
                    option: 'required:true',
                  },
                },
                image1: {
                  destinationUrl: {
                    option: 'required|url:true',
                    parseUrl: true,
                  },
                  alt: {
                    option: 'required:true',
                  },
                },
              },
            },
            data: {
              optionValue: 'option1',
              errors: [
                { message: 'No query results for model [Stensul\\Models\\Campaign] 5b' },
                { message: 'No query results for model [Stensul\\Models\\Campaign] 5b' },
              ],
            },
            enabled: true,
            settings: true,
            isFixed: true,
            fixedPosition: 0,
            idInstance: 799228,
          }],
          editedSettings: {
            tags: ['tag', 'test'],
          },
          campaignValidated: false,
          currentModuleId: undefined,
          currentCustomModuleId: undefined,
          currentComponent: {
            moduleId: 0,
            columnId: 0,
            componentId: 0,
          },
          currentCustomComponent: {
            moduleId: 0,
            columnId: 0,
            componentId: 0,
          },
          activeModule: undefined,
          modalCode: false,
          modalComplete: false,
          modalPreview: false,
          modalProof: false,
          modalProofTrack: false,
          modalEnableTemplating: false,
          modalEsp: false,
          modalLiveClicker: false,
          buildingMode: 'desktop',
          editorToolbar: '',
          dirty: false,
          showImageEditor: false,
          fieldErrors: [{
            scope: {
              type: 'plugin',
              name: 'plugin.name',
              moduleId: 0,
              columnId: 0,
              componentId: 0,
            },
          }],
          showModuleSettings: false,
        },
        getters: storeCampaign.getters,
        mutations: storeCampaign.mutations,
        actions: storeCampaign.actions,
      });
    });
    afterAll(() => {
      campStore = null;
    });
    it('"modules" expect to get modules values', (done) => {
      expect(campStore.getters.modules).toEqual(campStore.state.modules);
      done();
    });
    it('"campaign" expect to get campaign values', (done) => {
      expect(campStore.getters.campaign).toEqual(campStore.state.campaign);
      done();
    });
    it('"moduleErrors" expect to get true', (done) => {
      expect(campStore.getters.moduleErrors).toBeTruthy();
      done();
    });
    it('"getModuleErrors" expect to get the modules with errors', (done) => {
      expect(campStore.getters.getModuleErrors).toEqual(campStore.state.modules);
      done();
    });
    it('"fieldErrors" expect to get the fieldErrors values', (done) => {
      expect(campStore.getters.fieldErrors).toEqual(campStore.state.fieldErrors);
      done();
    });
    it('"currentComponent" expect to get the currentComponent values', (done) => {
      expect(campStore.getters.currentComponent).toEqual(campStore.state.currentComponent);
      done();
    });
    it('"currentCustomComponent" expect to get the currentCustomComponent values', (done) => {
      expect(campStore.getters.currentCustomComponent).toEqual(campStore.state.currentCustomComponent);
      done();
    });
    it('"currentModule" expect to get the currentModuleId values', (done) => {
      expect(campStore.getters.currentModule).toEqual(campStore.state.currentModuleId);
      done();
    });
    it('"activeModule" expect to get the activeModule values', (done) => {
      expect(campStore.getters.activeModule).toEqual(campStore.state.activeModule);
      done();
    });
    it('"currentCustomModule" expect to get the currentCustomModuleId values', (done) => {
      expect(campStore.getters.currentCustomModule).toEqual(campStore.state.currentCustomModuleId);
      done();
    });
    it('"buildingMode" expect to get the buildingMode values', (done) => {
      expect(campStore.getters.buildingMode).toEqual(campStore.state.buildingMode);
      done();
    });
    it('"templateWidth" expect to get the templateWidth values', (done) => {
      expect(campStore.getters.templateWidth).toEqual(800);
      done();
    });
    it('"editorToolbar" expect to get the editorToolbar values', (done) => {
      expect(campStore.getters.editorToolbar).toEqual(campStore.state.editorToolbar);
      done();
    });
  });
});
