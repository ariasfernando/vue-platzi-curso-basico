<template>
  <div class="row header">
    <div class="col-xs-3 header-col">
      <div class="beta-btn-secondary pull-left" @click="$router.push('/')">
        <i class="glyphicon glyphicon-menu-left"></i>
          <a href="#" >Back</a>
      </div>
      <div class="col-xs-8 section-title vertical-center">New Module</div>
    </div>

    <div class="col-xs-6 header-col">
      <div class="section-title vertical-center">
        <stui-switch-desktop-mobile v-model="buildingMode" />
      </div>
    </div>

    <div class="col-xs-3 header-col">
      <div class="vertical-center pull-right">
        <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" v-if="$can('std_raw')" @click.prevent="toggleRaw">Raw</a>
        <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('draft')" :disabled="errors.any()">Save as draft<i class="glyphicon glyphicon-menu-right"></i></a>
        <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('publish')">Publish<i class="glyphicon glyphicon-menu-right"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    module() {
      return this.$store.getters['module/module'];
    },
    buildingMode: {
      get() {
        return this.$store.getters['module/buildingMode'];
      },
      set(value) {
        this.$store.commit('module/setBuildingMode', value);
      },
    },
  },
  data() {
    return {
      showRaw: false,
    };
  },
  methods: {
    toggleRaw() {
      this.$store.commit('module/toggleRaw');
    },
    setModuleField(data) {
      this.$store.commit('module/setModuleFields', data);
    },
    saveModule(status) {
      this.$store.commit('global/setLoader', true);
      this.setModuleField({ status });

      let data = this.module;

      this.$store
        .dispatch('module/saveModuleData', data)
        .then(response => {
          this.$store.commit('global/setLoader', false);
          if (this.module.status === 'publish') {
            this.$router.push('/');
          } else if (this.module.status === 'draft' && data.moduleId) {
            this.$router.push('/edit/' + data.moduleId);
          }
          this.$root.$toast('Module Saved', { className: 'et-success' });
        })
        .catch(error => {
          this.$store.commit('global/setLoader', false);
          if (error.status === 422) {
            this.$root.$toast(
              this.$options.filters.parseValidationErrors(error),
              {
                className: 'et-error',
                closeable: true,
                duration: 10000,
              },
            );
          } else {
            this.$root.$toast(
              "Oops! Something went wrong! Please try again. If it doesn't work, please contact our support team.",
              {
                className: 'et-error',
              },
            );
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
@stensul-purple: #514960;
@stensul-white: #ffffff;
.header {
  position: fixed;
  top: 59px;
  z-index: 2;
  left: 15px;
  right: 15px;
  color: @stensul-purple;
  background-color: #ffffff;
  height: 45px;
  padding: 13px 0;
  box-shadow: 0px 0px 4px #999999;
  margin-top: -3px;
  min-width: 1200px;
  .header-col {
    height: 100%;
  }
  .vertical-center {
    min-height: 100%;
    display: flex;
    align-items: center;
  }
  .section-title {
    font-size: 18px;
    font-family: 'Open Sans', Arial, sans-serif;
    font-weight: 300;
    margin-top: -1px;
  }
}
</style>
