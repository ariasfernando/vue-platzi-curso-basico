<template>
  <transition name="modal" v-if="modalEditFont">
    <div class="modal-mask">
      <div class="modal-wrapper modal-font">
        <div class="modal-container">
          <slot name="header">
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </slot>

          <h4>Edit Font Family</h4>

          <div class="modal-body">
            <slot name="body">

              <div>
                <label for="name">Name</label>
                <p class="control">
                  <el-input
                      name="fontFamilyName"
                      v-model="fontFamilyName"
                      v-validate="'required'"
                      placeholder="Enter name here."
                      :class="{'is-danger': errors.has('name') }"
                  ></el-input>
                  <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                </p>
              </div>

              <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadEndpoint"
                :headers="headerCSRF"
                :before-remove="beforeRemove"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="fileList">
                <el-button size="small" type="primary">Upload font</el-button>
              </el-upload>

            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div class="modal-footer">
                <a target="_blank" type="button" class="btn beta-btn-primary pull-right" @click="saveFontFamily">Save</a>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BootstrapVue from 'bootstrap-vue';
  import settingService from '../../../services/setting'

  export default {
    components: {
      BootstrapVue,
    },
    computed: {
      modalEditFont () {
        return this.$store.getters["setting/modalEditFont"];
      },
      fontFamilyList () {
        return this.$store.getters["setting/customFontsList"];
      },
      headerCSRF () {
        return  {'X-CSRF-token': Application.globals.csrfToken}
      },
      uploadEndpoint(){
        return this.$_app.config.baseUrl + "/admin/setting/upload-font";
      },
      currentFont(){
        return this.$store.getters["setting/currentFont"];
      },
    },
    data () {
      return {
        fontFamilyName: '',
        fileList: [],
      }
    },
    watch: {
      currentFont(val) {
        if(val !== undefined) {
          this.fontFamilyName = this.fontFamilyList[val].name;
          this.fileList = this.fontFamilyList[val].fonts;
        } else {
          this.fontFamilyName = '';
          this.fileList = [];
        }
      },
    },
    methods: {
      handleSuccess(r, f, fl) {
        this.fileList = fl.map(v => v.path = v.response.path);
        this.fileList = fl;
      },
      handleRemove(f, fl) {
        this.fileList = fl;
      },
      beforeRemove(f, fl) {
        return this.$confirm(`Are you sure?`);
      },
      close () {
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
            this.ready = true;
            this.loading = false;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-error'});
          });
      },
      saveFontFamily() {
        const fontFamilyData = {'name': this.fontFamilyName,'fonts': this.fileList};
        const fontFamilyList = _.cloneDeep(this.fontFamilyList)
        if(this.currentFont !== undefined) {
          fontFamilyList[this.currentFont] = fontFamilyData;
        } else {
          fontFamilyList.push(fontFamilyData);
        }
        this.$store.commit("setting/setCustomFontsList", fontFamilyList);
        this.saveSetting('custom_fonts', fontFamilyList);
        this.close();
      }
    },
    created () {
      if(this.currentFont !== undefined){
        this.fontFamilyName = this.fontFamilyList[this.currentFont].name;
        this.fileList = this.fontFamilyList[this.currentFont].fonts;
      }
    }
  };
</script>

<style lang="less">
.modal-font {
  width: 750px;
  .modal-container {
      width: 750px;
  }
}

.modal-mask {
  z-index: 100 !important;
}

input[type="file"] {
  display: none !important;
}

.el-upload__input {
  display: none !important;
}
</style>

