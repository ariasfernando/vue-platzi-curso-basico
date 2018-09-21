<template>
  <top-bar-container>
    <template slot="left">
      New Module
    </template>
     <template slot="center">
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
    </template>
    <template slot="right">
      <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="toggleRaw">Raw</a>
      <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('draft')" :disabled="errors.any()">Save as draft<i class="glyphicon glyphicon-menu-right"></i></a>
      <a class="btn btn-continue beta-btn-secondary m-l-button" href="#" @click.prevent="saveModule('publish')">Publish<i class="glyphicon glyphicon-menu-right"></i></a>
    </template>
  </top-bar-container>
</template>

<script>
  import TopBarContainer from 'stensul/components/common/containers/TopBarContainer.vue';

  export default {
    components: {
      TopBarContainer,
    },
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
