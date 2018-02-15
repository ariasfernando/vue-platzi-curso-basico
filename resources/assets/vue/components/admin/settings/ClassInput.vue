<template>
  <div class="form-group" :class="'field-' + setting">
    <label class="col-sm-12 control-label">Classes</label>
    <div class="col-sm-12 position-relative">
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
      </el-tag>

      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>

      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Add Class</el-button>

    </div>
  </div>
</template>

<script>

  import _ from 'lodash';
  import clone from 'clone';

  export default {
    name: 'ClassInput',
    props: ['setting'],
    computed: {
      currentComponent() {
        return this.$store.getters["module/currentComponent"];
      },
      dynamicTags() {
        const module = this.$store.getters["module/module"];
        const component = module.structure.columns[this.currentComponent.columnId].components[this.currentComponent.componentId];

        return component.attribute.classes;
      },
    },
    data() {
      return {
        inputVisible: false,
        inputValue: ''
      }
    },
    methods: {
      handleClose(tag) {
        let tags = clone(this.dynamicTags);
        tags.splice(this.dynamicTags.indexOf(tag), 1);
        this.updateAttribute(tags);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue && this.dynamicTags.indexOf(inputValue) === -1) {
          const classes = _.union(this.dynamicTags, [inputValue]);
          this.updateAttribute(classes);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      updateAttribute(val) {
        this.$store.commit('module/saveComponentAttribute', {
          columnId: this.currentComponent.columnId,
          componentId: this.currentComponent.componentId,
          attribute: 'classes',
          attributeValue: val,
        });
      },
    }
  }
</script>

<style>
  .el-tag {
    margin: 3px;
  }

  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }
</style>
