/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint no-console: 0 */
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
import campaignStore from '@/store/campaignStore';
// import mocks from '@/resources/mocks';

const localVue = createLocalVue();

localVue.use(Vuex);

function createStore(option) {
  return new Vuex.Store(option);
}

/*
 * == Test: Models
 */
describe('== Library Store ==', () => {
  let baseUrl;
  let store;
  beforeAll(() => {
    baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
  });
  beforeEach(() => {
    store = createStore({
      strict: true,
      modules: {
        campaign: cloneDeep(campaignStore),
      },
    });
  });
  afterEach(() => {
    store = null;
  });
  afterAll(() => {
    baseUrl = null;
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
      let modulesData = [
        {
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
        },
      ];

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

      let newStruct = [
        {
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
        },
      ];

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
        value: '#000'
      };
      
      let newStruct = [
        {
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
        },
      ];

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
      let modulesData = [
        {
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
      ];

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
      let modulesData = [
        {
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
        },
      ];

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
            preset: [
              {
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
      let modulesData = [
        {
          structure: {
            columns: [
              {
                components: [
                  {
                    plugins: {
                      styleImageEditor: {
                        data: {},
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      ];

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
      let modulesData = [
        {
          structure: {
            columns: [
              {
                components: [
                  {
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
        },
      ];

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
      let modulesData = [
        {
          structure: {
            columns: [
              {
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
        },
      ];

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
      let modulesData = [
        {
          structure: {
            columns: [
              {
                container: {
                  attribute: {
                    width: '50%',
                    valign: 'middle',
                  },
                },
              },
            ],
          },
        },
      ];

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
  });

  xdescribe('trigger actions', () => {
    let original;
    beforeAll(() => {
      original = console.error;
    });

    beforeEach(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error.mockClear();
      console.error = original;
    });

    afterAll(() => {
      nock.cleanAll();
      nock.restore();
      original = null;
    });

    it('', (done) => {
      done();
    });

    it('', (done) => {
      done();
    });
  });

  xdescribe('trigger getters', (done) => {
    it('', () => {
      done();
    });
  });
});
