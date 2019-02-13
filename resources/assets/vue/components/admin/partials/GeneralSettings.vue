<template>
  <div>
    <label-item-container v-b-toggle.general-settings-styles label="General Settings" icon="glyphicon-cog" />
    <b-collapse id="general-settings-styles" visible accordion="general-settings">
      <b-card class="control">
        <input-generic-text
          label="Module name"
          :element="module"
          placeholder="Module name"
          name="name"
          @setting-updated="nameUpdatedHandler" />
        <input-generic-text
          label="Description"
          :element="module"
          placeholder="Description"
          name="description"
          type="textarea"
          setting-position="setting-bottom"
          :autosize="{ minRows: 2, maxRows: 4}"
          resize="none"
          @setting-updated="descriptionUpdatedHandler" />
        <input-generic-number
          label="Columns"
          name="length"
          :element="module.structure.columns"
          :min-value="1"
          :max-value="8"
          @setting-updated="settingColumnsHandler" />
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import * as elementSettings from '../settings';
import LabelItemContainer from '../../common/containers/LabelItemContainer.vue';
import settingsDefault from '../settingsDefault';

export default {
  name: 'GeneralSettings',
  components: {
    LabelItemContainer,
    'input-generic-text': elementSettings.GenericText,
    'input-generic-number': elementSettings.GenericNumber,
  },
  data() {
    return {
      maxCols: 8,
    };
  },
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    settings() {
      return settingsDefault.Module().componentSettings;
    },
  },
  methods: {
    settingColumnsHandler(eventData) {
      const cols = eventData.value;
      const numCols = this.module.structure.columns.length;
      if (numCols === cols) {
        return true;
      }
      if (numCols > cols) {
        this.$store.commit('module/removeColumns', {
          index: cols,
          number: numCols - cols,
        });
        // unSet current component
        this.$store.commit('module/setCurrentComponent', {
          columnId: undefined,
          componentId: undefined,
        });
      }
      if (numCols < cols) {
        for (let i = numCols; i < cols; i++) {
          this.$store.dispatch('module/addColumn');
        }
      }
      this.$store.dispatch(
        'module/normalizeColumns',
        this.module.structure.columns,
      );
      return true;
    },
    nameUpdatedHandler(eventData) {
      this.setModuleField({ name: eventData.value });
    },
    setModuleField(data) {
      this.$store.commit('module/setModuleFields', data);
    },
    descriptionUpdatedHandler(eventData) {
      this.setModuleField({ description: eventData.value });
    },
  },
};
</script>
