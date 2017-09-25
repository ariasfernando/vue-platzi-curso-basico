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
        buildingMode: 'desktop'
      }
    },
    directives: {
      'sticky': VueSticky,
    },
    methods: {
      toggleRaw() {
        this.showRaw = !this.showRaw;
      },
      changeBuildingMode(mode) {
        this.$store.commit("module/setBuildingMode", mode);
      },
      updateRawModule(e) {
        this.$store.commit("module/setModuleData", JSON.parse(e.target.value));
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