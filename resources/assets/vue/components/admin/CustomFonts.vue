<template>
  <div class="section-container-custom-fonts">
    <section class="col-xs-12 section-container">

      <div class="row">
        <div class="col-xs-12">
          <h2 class="pull-left">Custom Fonts List</h2>
          <div class="btn btn-default btn-create pull-right">
            <a href="#" class="btn-create" title="Edit" @click="openEditModal"><i class="glyphicon glyphicon-plus-sign"></i> Add a new font-family</a>          
          </div>
        </div>
      </div>

      <div class="row" v-if="ready && fonts">
        <div class="col-xs-12">

          <div class="table-responsive">
            <table width="100%" border="0" cellpadding="0" cellspacing="0"
                  class="table table-bordered table-striped sortable data-list" v-bind:class="{ loading: loading }">
              <thead>
              <tr>
                <th>
                  Font Family Name
                </th>
                <th>
                  Files / Urls
                </th>
                <th width="150" class="bold">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(fontFamily, key) in fonts">
                <td :title="fontFamily.name">{{ fontFamily.name }}</td>
                <td>
                  <p v-for="font in fontFamily.fonts">{{ font.path }}</p>
                </td>
                <td class="text-right actions icons">
                  <a href="#" class="edit" title="Edit" @click="openEditModal(key)"><i
                    class="glyphicon glyphicon-pencil"></i></a>
                  <a href="#" class="delete" title="Delete" @click="deleteFontFamily(key)"><i
                    class="glyphicon glyphicon-trash"></i></a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row" v-if="ready && !fonts.length">
        <div class="col-xs-12">
          There are no custom fonts uploaded.
        </div>
      </div>
    </section>

    <modal-edit-font v-if="ready"></modal-edit-font>

    <spinner></spinner>
  </div>
</template>

<script>
  import settingService from '../../services/setting'
  import configService from '../../services/config'
  import _ from 'underscore-contrib'
  import ModalEditFont from './modals/ModalEditFont.vue'
  import Spinner from '../common/Spinner.vue'

  export default {
    name: 'Fonts',
    components: {
      ModalEditFont,
      Spinner
    },
    data: function () {
      return {
        ready: false,
        loading: false,
      }
    },
    computed: {
      settings() {
        return this.$store.getters["setting/settings"];
      },
      fonts() {
        return this.$store.getters["setting/customFontsList"];
      },
    },
    methods: {
      deleteFontFamily (element) {
        if (confirm("Are you sure?")) {
            this.fonts.splice(element, 1);
            this.saveSetting('custom_fonts', this.fonts);
        }
      },
      fetchFonts () {
        this.loading = true;
        let settings = this.$store.getters["setting/settings"];
        let fonts = settings.find(setting => setting.key === "custom_fonts").value;
        this.$store.commit("setting/setCustomFontsList", fonts);

        this.ready = true;
      },
      openEditModal(element) {
        let fontPos = Number.isInteger(element) ? element : undefined;
        this.$store.commit("setting/setCurrentFont", fontPos);
        this.$store.commit("setting/toggleModal", 'modalEditFont');
      },
      saveSetting (key, value) {
        this.loading = true;
        let settingJson = {
          key: key,
          value:value
        }
        settingService.saveSetting(settingJson)
          .then((response) => {
            this.fetchFonts();
            this.ready = true;
            this.loading = false;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-error'});
          });
      }
    },
    created () {
      this.fetchFonts();
    },
  };
</script>

<style lang="less">
  @import '../../less/admin';

  .btn-create {
    color: #514960!important;
  }
  .btn-create:hover a{
    color: #514960!important;
  }
  .modules-list {
    display: block;
  }
  .modules-sub-list {
    padding-left: 20px;
    display: block;
  }
</style>