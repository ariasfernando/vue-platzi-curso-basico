<template>
  <transition v-if="modalEditFont" name="modal">
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
                    v-model="fontFamilyName"
                    v-validate="'required'"
                    class="font-name"
                    name="fontFamilyName"
                    placeholder="Enter name here."
                    size="small"
                    :class="{'is-danger': errors.has('name') }" />
                  <el-button icon="el-icon-circle-plus-outline" size="small" @click="addType">Add Type</el-button>
                  <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                </p>
              </div>
              <div v-for="(type, key) in fontTypes" class="font-types-container">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  multiple
                  accept=".eot,.ttf,.woff,.woff2"
                  :action="uploadEndpoint"
                  :headers="headerCSRF"
                  :on-success="(r, f, fl)=>handleSuccess(r, f, fl, key)"
                  :on-remove="(f, fl)=>handleRemove(f, fl, key)"
                  :before-remove="beforeRemove"
                  :file-list="type.files">

                  <el-select v-model="type.style" placeholder="Type" size="small">
                    <el-option
                      v-for="item in fontStyles"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
                  </el-select>
                  <el-select v-model="type.weight" placeholder="Weight" size="small">
                    <el-option
                      v-for="item in fontWeights"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
                  </el-select>
                  <el-button size="small" type="primary">Upload font</el-button>
                </el-upload>
                <hr>
                <i v-if="fontTypes.length > 1" class="el-icon-remove-outline remove-type" @click="removeType(key)" />
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div class="modal-footer">
                <a target="_blank" type="button" class="btn beta-btn-primary pull-right"
                   @click="saveFontFamily">Save</a>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import settingService from '../../../services/setting';

  export default {

    data() {
      return {
        fontFamilyName: '',
        fontTypes: [{
          weight: '400',
          style: 'normal',
          files: [],
        }],
        fontStyles: [{
          value: 'normal',
          label: 'Normal',
        }, {
          value: 'italic',
          label: 'Italic',
        }, {
          value: 'oblique',
          label: 'Oblique',
        }, {
          value: 'initial',
          label: 'Initial',
        }],
        fontWeights: [{
          value: '100',
          label: '100',
        }, {
          value: '200',
          label: '200',
        }, {
          value: '300',
          label: '300',
        }, {
          value: '400',
          label: '400',
        }, {
          value: '500',
          label: '500',
        }, {
          value: '600',
          label: '600',
        }, {
          value: '700',
          label: '700',
        }, {
          value: '800',
          label: '800',
        }, {
          value: '900',
          label: '900',
        }],
      };
    },
    computed: {
      modalEditFont() {
        return this.$store.getters['setting/modalEditFont'];
      },
      fontFamilyList() {
        return this.$store.getters['setting/customFontsList'];
      },
      headerCSRF() {
        return { 'X-CSRF-token': Application.globals.csrfToken };
      },
      uploadEndpoint() {
        return this.$_app.config.baseUrl + '/admin/setting/upload-font';
      },
      currentFont() {
        return this.$store.getters['setting/currentFont'];
      },
    },
    watch: {
      currentFont(val) {
        if (val !== undefined) {
          this.fontFamilyName = this.fontFamilyList[val].name;
          this.fontTypes = this.fontFamilyList[val].types;
        } else {
          this.fontFamilyName = '';
          this.fontTypes= [{
            weight: '400',
            style: 'normal',
            files: [],
          }];
        }
      },
    },
    created() {
      if (this.currentFont !== undefined) {
        this.fontFamilyName = this.fontFamilyList[this.currentFont].name;
        this.fontTypes = this.fontFamilyList[this.currentFont].fonts;
      }
    },
    methods: {
      handleSuccess(r, f, fl, key) {
        fl.map(v => {
          v.file = v.name.split('.').pop();
          });
        this.fontTypes[key].files = fl;
      },
      handleRemove(f, fl, key) {
        this.fontTypes[key].files = fl;
      },
      beforeRemove(f, fl) {
        return this.$confirm('Are you sure?');
      },
      close() {
        this.$store.commit('setting/toggleModal', 'modalEditFont');
      },
      saveSetting(key, value) {
        this.loading = true;
        const settingJson = {
          key,
          value,
        };
        settingService.saveSetting(settingJson)
          .then(() => {
            this.ready = true;
            this.loading = false;
          })
          .catch((error) => {
            this.$root.$toast(error, {className: 'et-error'});
          });
      },
      saveFontFamily() {
        const fontFamilyData = { name: this.fontFamilyName, source: 'studio', types: this.fontTypes };
        const fontFamilyList = _.cloneDeep(this.fontFamilyList)
        if (this.currentFont !== undefined) {
          fontFamilyList[this.currentFont] = fontFamilyData;
        } else {
          fontFamilyList.push(fontFamilyData);
        }
        this.$store.commit('setting/setCustomFontsList', fontFamilyList);
        this.saveSetting('custom_fonts', fontFamilyList);
        this.close();
      },
      addType() {
        const newType = {
          weight: '400',
          style: 'normal',
          files: []
        };
        this.fontTypes.push(newType);
      },
      removeType(typeKey) {
        this.fontTypes.splice(typeKey, 1);
        return false;
      },
    },
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
.font-name {
  width: 84%;
}
.font-types-container {
  padding-left: 30px;
  margin-bottom: 10px;
}
.remove-type {
  float:right;
  margin-top: -39px;
  margin-right: 5px;
}
</style>

