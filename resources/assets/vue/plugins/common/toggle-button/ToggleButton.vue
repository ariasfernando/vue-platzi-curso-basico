<template>
    <el-switch
      v-model="toggled"
      @change="toggle"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :width="width"
      :disabled="disabled"
      >

    </el-switch>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
      default: "#78DCD6"
    },
    inactiveColor: {
      type: String,
      default: "#dcdfe6"
    },
    width: {
      type: Number,
      default: 40
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      toggled: this.value
    };
  },
  methods: {
    toggle(value) {
      this.$emit('change', value);
    }
  }
};
</script>