<template>
  <settings-container label="Horizontal position">
    <template slot="setting-right">
      <stui-field addons>
        <stui-button
          size="mini"
          :active="align === 'left'"
          highlight
          expanded
          @click="changeAlignment('left')">
          <i class="glyphicon glyphicon-object-align-left" />
        </stui-button>
        <stui-button
          size="mini"
          :active="align === 'center'"
          highlight
          expanded
          @click="changeAlignment('center')">
          <i class="glyphicon glyphicon-object-align-vertical" />
        </stui-button>
        <stui-button
          size="mini"
          :active="align === 'right'"
          highlight
          expanded
          @click="changeAlignment('right')">
          <i class="glyphicon glyphicon-object-align-right" />
        </stui-button>
      </stui-field>
    </template>
  </settings-container>
</template>


<script>
import SettingMixin from '../mixins/SettingMixin';
import SettingsContainer from '../../common/settings/containers/SettingsContainer.vue';

export default {
  name: 'TextAlign',
  components: { SettingsContainer },
  mixins: [SettingMixin],
  data() {
    return {
      linkName: 'align',
    };
  },
  computed: {
    align: {
      get() {
        return this.element.attribute[this.linkName];
      },
      set(newValue) {
        this.$emit('setting-updated', {
          subComponent: this.subComponent,
          link: 'attribute',
          name: this.linkName,
          value: newValue,
        });
      },
    },
  },
  methods: {
    changeAlignment(newValue) {
      this.align = newValue;
    },
  },
};
</script>
