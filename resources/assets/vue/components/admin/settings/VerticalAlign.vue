<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-6 control-label">Vertical align</label>
    <el-button plain size="mini" @click="changeAlignment('top')" class="fa fa-arrow-up" :class="{ active: currentValue == 'top' }"></el-button>
    <el-button plain size="mini" @click="changeAlignment('middle')" class="fa fa-minus" :class="{ active: currentValue == 'middle' }"></el-button>
    <el-button plain size="mini" @click="changeAlignment('bottom')" class="fa fa-arrow-down" :class="{ active: currentValue == 'bottom' }"></el-button>
  </div>
</template>

<script>
export default {
  name: "VerticalAlign",
  props: ["setting"],
  data() {
    return {
    };
  },
  computed: {
    currentComponent() {
      return this.$store.getters["module/currentComponent"];
    },
    component() {
      const module = this.$store.getters["module/module"];
      const component =
        module.structure.columns[this.currentComponent.columnId].components[
          this.currentComponent.componentId
        ];
      return component;
    },
    currentValue() {
      return this.component.attribute['valign'];
    }
  },
  methods: {
    changeAlignment(align) {
      this.saveAttribute(align);
    },
    saveAttribute(newValue) {
      this.$store.commit("module/saveComponentAttribute", {
        columnId: this.currentComponent.columnId,
        componentId: this.currentComponent.componentId,
        property: 'valign',
        value: newValue
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-button:focus,
.el-button:hover {
  color: inherit;
  border-color: inherit;
  background-color: inherit;
}
.el-button.active{
  color: #ffffff;
  border-color: rgb(120, 220, 214);
  background-color: rgb(120, 220, 214);
}
</style>
