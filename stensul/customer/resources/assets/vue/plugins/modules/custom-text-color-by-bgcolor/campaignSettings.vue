<template>
    <div>
        <!-- choose cta skin -->
        <SettingsContainer :label="plugin.title">
            <template slot="setting-bottom">
                <StuiSelect v-model="value" :placeholder="plugin.title" :list="skins" />
            </template>
        </SettingsContainer>
        <SettingsContainer label="Text color" custom-class="generic-color">
            <template slot="setting-right">
                <StuiColorPicker v-model="colors" :palette="palette"/>
            </template>
        </SettingsContainer>
        <SettingsContainer custom-class="generic-color" label="Border color" v-if="plugin.data.skin !== 'Without borders'">
          <template slot="setting-right">
            <StuiColorPicker v-model="borderColors" />
          </template>
        </SettingsContainer>
    </div>
</template>

<script>
import pluginCampaignMixin from 'stensul/plugins/modules/mixins/pluginCampaignMixin';
import SettingsContainer from 'stensul/components/common/settings/containers/SettingsContainer.vue';

export default {
  mixins: [pluginCampaignMixin],
  components: {
    SettingsContainer,
  },
  data() {
    return {
      subComponent: 'button',
    };
  },
  computed: {
    value: {
      get() {
        return this.plugin.data.skin;
      },
      set(newValue) {
        this.changeSkin(newValue);
        document
          .getElementById(this.tinyId)
          .dispatchEvent(new Event('tiny-style-reset'));
      },
    },
    skins() {
      return this.plugin.config.skins;
    },
    borderColor() {
      return this.element.button.style.borderBottomColor;
    },
    borderColors: {
      get() {
        return this.borderColor;
      },
      set(colorValue) {

        // When colorValue is false, set the default border color
        if(!colorValue){
          const activeSkin = _.find(this.skins, { name: this.value });
          colorValue = activeSkin.style.borderBottomColor;
        }

        if (colorValue.hex) colorValue = colorValue.hex;
        if (!Application.utils.validateHexVal(colorValue)) {
          colorValue === null ? '' : Application.utils.rgbToHex(colorValue);
        }

        this.saveBorderColors(colorValue);
      },
    },
    palette() {
      return this.plugin.config.options.color.palette.map((color) =>
        color[0] !== '#' ? `#${color.toUpperCase()}` : color.toUpperCase(),
      );
    },
    color() {
      return this.element.button.style.color;
    },
    colors: {
      get() {
        return this.color;
      },
      set(value) {
        if (value.hex) value = value.hex;

        if (!Application.utils.validateHexVal(value)) {
          value === null ? '' : Application.utils.rgbToHex(value);
        }
        this.saveElementInThisPluginData({
          value: {
            skin: this.plugin.data.skin,
            color: value,
          },
        });
        this.saveStyleInThisElement({ property: 'color', value });
        this.updateTiny();
      },
    },
  },
  methods: {
    getColor() {
      return this.plugin.data.color;
    },
    proccessValue(value) {
      const methodName = value;
      const returnData = this[methodName] ? this[methodName]() : value;
      return returnData;
    },
    changeSkin(option) {
      const color = this.color;
      this.saveElementInThisPluginData({
        value: {
          skin: option,
          color,
        },
      });
      const skin = _.find(this.skins, { name: option });

      _.each(skin.attribute, (newValue, property) => {
        this.saveAttributeInThisElement({
          property,
          value: this.proccessValue(newValue),
        });
      });

      _.each(skin.style, (newValue, property) => {
        this.saveStyleInThisElement({
          property,
          value: this.proccessValue(newValue),
        });
      });

      this.saveBorderColors(this.borderColor);

      this.saveStyleInThisElement({ property: 'color', value: this.colors });
      this.updateTiny();
    },
    saveBorderColors(value) {
      const borders = [
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
      ];
      _.each(borders, (property) => {
        this.saveStyleInThisElement({ property, value });
      });
    },
    updateTiny() {
      setTimeout(this.triggerResetTiny.bind(this), 250);
      setTimeout(this.triggerResetTiny.bind(this), 1000);
    },
    triggerResetTiny() {
      document
        .getElementById(this.tinyId)
        .dispatchEvent(new Event('tiny-style-reset'))
    },
  },
  watch: {
    color() {
      const caretImage = this.color === '#000000' ? this.plugin.config.caretImage.caretDark : this.plugin.config.caretImage.caretLight;
      this.saveAttributeInThisElement({
        subComponent: 'caret',
        property: 'url',
        value: caretImage,
      });
    },
  },
};
</script>
