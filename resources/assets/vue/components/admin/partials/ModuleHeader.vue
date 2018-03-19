<template>
  <div class="row header" v-sticky="{ zIndex: 999, stickyTop: 0 }">
    <div class="col-xs-3 header-col">
      <div class="beta-btn-secondary pull-left" @click="$router.push('/')">
        <i class="glyphicon glyphicon-menu-left"></i>
          <a href="#" >Back</a>
      </div>
      <div class="col-xs-8 section-title vertical-center">New Module</div>
    </div>

    <div class="col-xs-6 header-col">
      <div class="section-title vertical-center">
        <div class="switch">
          <input type="radio" class="switch-input" name="view" value="desktop" id="desktop" checked>
          <label for="desktop" class="switch-label switch-label-off campaign-switch-view" @click="changeBuildingMode('desktop')">
            <i class="fa fa-desktop"></i>
          </label>
          <input type="radio" class="switch-input" name="view" value="mobile" id="mobile">
          <label for="mobile" class="switch-label switch-label-on campaign-switch-view" @click="changeBuildingMode('mobile')">
            <i class="glyphicon glyphicon-phone"></i>
          </label>
          <span class="switch-selection"></span>
        </div>
      </div>
    </div>

    <div class="col-xs-3 header-col">
      <div class="vertical-center pull-right">
        <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="toggleRaw">Raw</a>
        <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('draft')" :disabled="errors.any()">Save as draft<i class="glyphicon glyphicon-menu-right"></i></a>
        <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('publish')">Publish<i class="glyphicon glyphicon-menu-right"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
  import VueSticky from 'vue-sticky';

  export default {
    computed: {
      module() {
        return this.$store.getters["module/module"];
      },
      buildingMode() {
        return this.$store.getters["module/buildingMode"];
      }
    },
    data () {
      return {
        showRaw: false,
      }
    },
    directives: {
      'sticky': VueSticky,
    },
    methods: {
      toggleRaw() {
        this.$store.commit("module/toggleRaw");
      },
      changeBuildingMode(mode) {
        this.$store.commit("module/setBuildingMode", mode);
      },
      setModuleField(data) {
        this.$store.commit("module/setModuleFields", data);
      },
      saveModule(status) {
        this.$store.commit("global/setLoader", true);
        this.setModuleField({ status });

        let data = this.module;

        this.$store.dispatch("module/saveModuleData", data)
          .then( response => {
            if (!response) {
              this.$root.$toast('Error', {className: 'et-error'});
              this.$store.commit("global/setLoader", false);
              return;
            }

            this.$store.commit("global/setLoader", false);
            if (this.module.status === 'publish') {
              this.$router.push('/');
            } else if (this.module.status === 'draft' && data.moduleId) {
              this.$router.push('/edit/' + data.moduleId);
            }
            this.$root.$toast('Module Saved', {className: 'et-success'});
          }).catch( error => {
            this.$store.commit("global/setLoader", false);
            this.$root.$toast('Oops! Something went wrong! Please try again. If it doesn\'t work, please contact our support team.', {className: 'et-error'});
          });
      },
    }
  }
</script>
<style lang="less" scoped>

@stensul-purple: #514960;
@stensul-white: #ffffff;
  .header {
    color: @stensul-purple;
    background-color: #ffffff;
    height: 53px;
    padding: 17px 0;
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

    .switch {
      position: relative;
      height: 29px;
      width: 100px;
      background: @stensul-white;
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
      color: @stensul-purple;
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
      background: @stensul-purple;
      -webkit-transition: left 0.15s ease-out;
      -moz-transition: left 0.15s ease-out;
      -o-transition: left 0.15s ease-out;
      transition: left 0.15s ease-out;
    }    .back {
      border-right: 1px solid #ffffff;

      i {
        font-size: 24px;
        margin-right: 5px;
      }

      a {
        color: #ffffff;
      }
    }

    .section-title {
      font-size: 18px;
      font-family: "Open Sans", Arial, sans-serif;
      font-weight: 300;
      margin-top: -1px;
    }
  }

</style>
