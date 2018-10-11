<template>
  <div>
    <border
      :element="element"
      side="Top"
      @setting-updated="settingUpdatedHandler" />
    <border
      :element="element"
      side="Right"
      @setting-updated="settingUpdatedHandler" />
    <border
      :element="element"
      side="Bottom"
      @setting-updated="settingUpdatedHandler" />
    <border
      :element="element"
      side="Left"
      @setting-updated="settingUpdatedHandler" />
  </div>
</template>

<script>
import Border from './Border.vue';
import SettingMixin from '../mixins/SettingMixin';

export default {
  name: 'BorderGroup',
  components: { Border },
  mixins: [SettingMixin],
  methods: {
    settingUpdatedHandler(eventData) {
      this.$emit('setting-updated', {
        subComponent: this.subComponent,
        link: 'style',
        name: eventData.name,
        value: eventData.value,
      });
    },
  }
};
</script>
