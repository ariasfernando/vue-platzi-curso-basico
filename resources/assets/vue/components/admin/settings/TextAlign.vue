<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="typo__label col-sm-6 control-label">Horizontal align</label>
    <el-button plain size="mini" @click="changeAlignment('left')" class="fa fa-align-left" :class="{ active: currentValue == 'left' }"></el-button>
    <el-button plain size="mini" @click="changeAlignment('center')" class="fa fa-align-center" :class="{ active: currentValue == 'center' }"></el-button>
    <el-button plain size="mini" @click="changeAlignment('right')" class="fa fa-align-right" :class="{ active: currentValue == 'right' }"></el-button>
  </div>
</template>

<script>
export default {
  name: "TextAlign",
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
      return this.component.attribute['align'];
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
        property: 'align',
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
