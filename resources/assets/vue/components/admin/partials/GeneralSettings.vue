<template>
  <div>
    <label-item-container v-b-toggle.general-settings-styles label="General Settings" icon="glyphicon-cog" />
    <b-collapse id="general-settings-styles" visible accordion="general-settings">
      <b-card class="control">
        <group-container>
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
            label="Rows"
            name="length"
            :element="module.structure.rows"
            :min-value="1"
            :max-value="8"
            @setting-updated="settingRowsHandler" />
        </group-container>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import * as elementSettings from '../settings';
import LabelItemContainer from '../../common/containers/LabelItemContainer.vue';
import GroupContainer from '../../common/containers/GroupContainer.vue';
import settingsDefault from '../settingsDefault';

export default {
  name: 'GeneralSettings',
  components: {
    LabelItemContainer,
    'input-generic-text': elementSettings.GenericText,
    'input-generic-number': elementSettings.GenericNumber,
    GroupContainer,
  },
  data() {
    return {
      maxRows: 6,
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
    settingRowsHandler({value}) {
      const Rows = value;
      const numRows = this.module.structure.rows.length;
      if (numRows === Rows) {
        return true;
      }
      if (numRows > Rows) {
        this.$store.commit('module/removeRows', {
          index: Rows,
          number: numRows - Rows,
        });
        // unSet current component
        this.$store.commit('module/setCurrentElementId', false);
      }
      if (numRows < Rows) {
        for (let i = numRows; i < Rows; i++) {
          this.$store.dispatch('module/addRow');
        }
      }
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
