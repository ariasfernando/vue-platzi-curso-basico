<template>
  <div class="switch">
    <input id="desktop" value="desktop" type="radio" class="switch-input" name="view" :checked="device === 'desktop'">
    <label for="desktop" class="switch-label switch-label-off campaign-switch-view" @click="device = 'desktop'">
      <i class="fa fa-desktop" />
    </label>
    <input id="mobile" value="mobile" type="radio" class="switch-input" name="view" :checked="device === 'mobile'">
    <label for="mobile" class="switch-label switch-label-on campaign-switch-view" @click="device = 'mobile'">
      <i class="glyphicon glyphicon-phone" />
    </label>
    <span class="switch-selection" />
  </div>
</template>

<script>
export default {
  name: 'SwitchDesktopMobile',
  props: {
    value: {
      type: [String],
      default: 'desktop',
    },
  },
  computed: {
    device: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
        this.$emit('change', value);
      },
    },
  },
};
</script>
<style lang='scss' scoped>
.switch {
  position: relative;
  height: 29px;
  width: 100px;
  background: #fff;
  border-radius: 3px;
  margin: 0 auto;
  border: 1px solid #dfdfdf;
  margin-top: -3px;
}
.switch-label {
  position: relative;
  z-index: 2;
  float: left;
  width: 49px;
  line-height: 21px;
  font-size: 16px;
  color: #514960;
  text-align: center;
  cursor: pointer;
  margin: 0 !important;
  i {
    display: inline-block;
    vertical-align: sub;
  }
}
.switch-label:active {
  font-weight: bold;
}
.switch-label-off {
  padding-left: 2px;
}
.switch-label-on {
  padding-right: 2px;
}
.switch-input {
  display: none;
}
.switch-input:checked + .switch-label {
  font-weight: bold;
  color: #fff;
  -webkit-transition: 0.15s ease-out;
  -moz-transition: 0.15s ease-out;
  -o-transition: 0.15s ease-out;
  transition: 0.15s ease-out;
}
.switch-input:checked + .switch-label-on ~ .switch-selection {
  left: 50px;
}
.switch-selection {
  display: block;
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 2px;
  width: 46px;
  height: 23px;
  border-radius: 2px;
  background: #514960;
  transition: left 0.15s ease-out;
}
.back {
  border-right: 1px solid #ffffff;
  i {
    font-size: 24px;
    margin-right: 5px;
  }
  a {
    color: #ffffff;
  }
}
</style>
