<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-12 control-label">Font Family</label>

    <div class="col-sm-12">
      
        <el-select
        class="width-full"
        multiple
        placeholder="Font Family"
        v-model="fontFamily"
        @change="saveValue"
        size="mini"
        >
          <el-option
            v-for="item in options()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
  
    </div>

  </div>
</template>

<script>
import _ from "lodash";
import clone from "clone";
import Multiselect from "vue-multiselect";

export default {
  name: "FontFamily",
  props: ["setting"],
  components: {
    Multiselect
  },
  data() {
    return {
      options() {
        const options = [];
        _.each(this.$_app.config.fonts, group => {
          _.each(group, font => {
            options.push({
              value: font,
              label: font
            });
          });
        });

        return options;
      }
    };
    fontFamilyData: this.fontFamily;
  },
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    fontFamily() {
      const module = this.$store.getters["module/module"];
      const component =
        module.structure.columns[this.currentComponent.columnId].components[
          this.currentComponent.componentId
        ];

      if (!component.style.fontFamily) {
        return [];
      }

      return component.style.fontFamily.split(", ");
    }
  },
  methods: {
    saveValue(val) {
      this.$store.commit("module/saveComponentStyle", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: "fontFamily",
        value: val.join(", ")
      });
    }
  },
  watch: {
    fontFamily(value) {
      this.fontFamilyData = value;
    }
  }
};
</script>
<style lang="less" scoped>
.width-full {
  width: 100%;
}
</style>
