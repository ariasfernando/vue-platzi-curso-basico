<template>
  <div class="simple-text-config library-menu-container">
    <div class="row library-menu-buttons-container">
      <div class="library-menu-buttons">
        <stui-button type="secondary" @click="addEmptyItem">
          <i class="glyphicon glyphicon-plus-sign" />
          Add Module
        </stui-button>
        <stui-button type="secondary" @click="addGroup">
          <i class="glyphicon glyphicon-folder-close" />
          Add Group
        </stui-button>
        <stui-button type="default">
          <i class="glyphicon glyphicon-cog" />
          Advanced
        </stui-button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-offset-3 col-md-6">
        <div id="modules-container">
          <draggable v-model="library.modules" class="drag-component-menu components-list" :options="{group:'menuList'}">
            <div v-for="(group, idx) in library.modules" :id="'modules-' + group.name" :key="idx" class="list-item-container">
              <div v-if="group.type == 'sub-menu'" :id="'group-container-' + group.name" class="submenu-container">
                <div class="group-header">
                  <span :class="{ 'control': true }">
                    <input v-model="group.name" v-validate="'required'"
                           :class="{'input': true, 'is-danger': errors.has('groupName-' + idx) }"
                           :name="'modules[' + idx + '][name]'" type="text" placeholder="Enter group name">
                    <span v-show="errors.has('groupName-' + idx)"
                          class="help is-danger">{{ errors.first('groupName-' + idx) }}</span>
                  </span>
                  <span class="glyphicon glyphicon-trash group-remove" @click.prevent="deleteGroup(idx)" />
                </div>
                <draggable v-model="group.modules" class="drag-component-menu" :options="{group:'menuList'}" @add="onAdd">
                  <template v-for="(module, modIdx) in group.modules">
                    <div :key="modIdx" class="item inner-item" effect="light" placement="left">
                      <li class="component-item list-group-item inner">
                        <span class="glyphicon glyphicon-option-vertical draggable-icon" />
                        <div class="component-item-description">
                          <input v-model="module.name" v-validate="'required'"
                                 :class="{'input': true , 'menu-item' : true }" type="text" placeholder="Enter module name"
                                 :name="'modules[' + modIdx + '][name]'">
                          <div class="component-item-id">
                            <i class="glyphicon glyphicon-chevron-down dropdown-icon" />
                            <el-autocomplete
                              v-if="module.moduleId == ''"
                              v-model="state"
                              v-validate="'required'"
                              :name="`module-${modIdx}-autocomplete`"
                              class="inline-input"
                              :fetch-suggestions="querySearch"
                              placeholder="Undefined"
                              @select="(item) => handleSelect(item, modIdx, idx)" />
                            <span v-else class="component-item-name">{{ module.moduleId }}</span>
                          </div>
                        </div>
                        <span class="glyphicon glyphicon-trash remove-icon" @click="deleteItem(group.modules,modIdx)" />
                      </li>
                    </div>
                  </template>
                </draggable>
              </div>
              <div class="item" effect="light" placement="left">
                <li v-if="group.type == 'item'" class="component-item list-group-item">
                  <span class="glyphicon glyphicon-option-vertical draggable-icon" />
                  <div class="component-item-description">
                    <input v-model="group.name" v-validate="'required'"
                           :class="{'input': true , 'menu-item' : true }" type="text" placeholder="Enter module name"
                           :name="'group[' + idx + '][name]'">
                    <div class="component-item-id">
                      <i class="glyphicon glyphicon-chevron-down dropdown-icon" />
                      <el-autocomplete
                        v-if="group.moduleId == ''"
                        v-model="state"
                        v-validate="'required'"
                        :name="`group-${idx}-autocomplete`"
                        class="inline-input"
                        :fetch-suggestions="querySearch"
                        placeholder="Undefined"
                        @select="(item) => handleSelect(item, idx)" />
                      <span v-else class="component-item-name">{{ group.moduleId }}</span>
                    </div>
                  </div>
                  <span class="glyphicon glyphicon-trash remove-icon" @click="deleteItem(library.modules,idx)" />
                </li>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <!-- Field fixed modules" -->
    <div class="row">
      <div v-if="library.config" class="col-md-12">
        <label for="fixedModules">Fixed modules config:</label>
        <p class="control">
          <textarea v-model="library.config.fixedModules" rows="10" name="fixedModules" type="text" placeholder="" />
        </p>
      </div>
    </div>
    <!-- Input submit  -->
    <div class="row">
      <div class="col-md-12">
        <button type="submit" class="btn btn-success pull-right submit-config hidden" :disabled="errors.any()">Submit
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import Vue from 'vue';

export default {
  name: 'LibraryMenuEditor',
  components: {
    Draggable,
  },
  props: {
    library: {
      type: [Object],
      default() {
        return {};
      },
    },
    modules: {
      type: [Array],
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      state: '',
    };
  },
  computed: {
    fixedModules: {
      get() {
        return this.library.config.fixedModules ? this.library.config.fixedModules : '';
      },
      set(fixedModules) {
        this.library.config.fixedModules = JSON.stringify(fixedModules);
      },
    },
  },
  methods: {
    onAdd(e) {
      const cloneItem = e.item;
      if (cloneItem.parentNode) {
        cloneItem.parentNode.removeChild(cloneItem);
      }
    },
    addGroup() {
      this.temporal = this.temporal || 1;
      const tmpName = `Unnamed Group ${this.temporal++}`;

      this.library.modules.push({
        name: tmpName,
        type: 'sub-menu',
        modules: [],
      });
    },
    deleteGroup(idx) {
      this.library.modules.splice(idx, 1);
    },
    deleteItem(menu, idx) {
      menu.splice(idx, 1);
    },
    querySearch(queryString, cb) {
      const modules = this.modules;
      const results = queryString ? modules.filter(this.createFilter(queryString)) : modules;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) {
      return (module) => {
        return (module.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item, idx, groupIdx) {
      this.addItem(item.value, idx, groupIdx);
      this.state = '';
    },
    addItem(moduleId, idx, groupIdx) {
      const itemData = {
        name: moduleId,
        moduleId,
        type: 'item',
      };
      if (groupIdx || groupIdx === 0) {
        Vue.set(this.library.modules[groupIdx].modules, idx, itemData);
      } else {
        Vue.set(this.library.modules, idx, itemData);
      }
    },
    addEmptyItem() {
      const itemData = {
        name: '',
        moduleId: '',
        type: 'item',
      };
      this.library.modules.push(itemData);
    },
  },
};
</script>
<style lang="scss" scoped>
.library-menu-container {
  box-sizing: border-box;
  position: relative;
  padding: 15px;
  background-color:#f0f0f0;
  border-radius: 2px;

  .library-menu-buttons-container {
    margin-bottom: 10px;
  
    .library-menu-buttons {
      float: right;
      margin-right: 15px;
    }
  }
}

.list-item-container {
  margin-bottom: 5px;

  .submenu-container {
    background-color: #ffffff;
    border: 1px solid #ded8d8;
    border-radius: 4px;

    .group-header {
      color: #6f6b6b;
      padding: 10px 10px 0px 10px;

      .group-remove {
        float: right;
        color: #808080;
      }
    }
  }
}

.list-group-item {
  background-color: #ffffff;

  &.inner {
    background-color: #fbfafa;
  }
}

.group-remove-container {
  width: 50%;
  text-align: right;
}

.dropdown-icon {
  position: absolute;
  top: 5px;
  pointer-events: none;
}

.inline-input /deep/ {
  input {
    height: 20px;
    border: 0px;
    background-color: transparent;
  }
}

.inner-item {
  margin: 7px 10px;
}

.remove-icon {
  float: right;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  right: 5px;
  color: #808080;
}

.item-name {
  width: 80%;
}

.is-danger {
  color: red;
}

.control {
  textarea {
    width: 100%;
    padding: 7px;
    font-size: 12px;
    color: #666;
    background: #fff;
    border: 1px solid #ddd;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-top-right-radius: 2px;
    border-top-left-radius: 2px;
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
  }
}

.input-group-addon i {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: text-top;
}
.drag-component-menu{
  min-height: 55px;

  input{
    width: 50% !important;
    border: none;
    font-weight: bold;
    font-size: 17px;
  }

  .menu-item{
    width: 100% !important;
    border: none;
    font-size: 17px;
    color: #666666;
    font-weight: 500;
    background-color: transparent;
  }
}
.components-list {
  padding: 0;
  margin: 0;

  p.module-id {
    color: #DDDDDD;
    font-size: 12px;
    cursor: text;
    margin: 0;
  }

  .component-item{
    cursor: pointer;
    list-style-type: none;
    font-size: 14px;
    border: 1px solid #eceaea !important;
    padding: 8px;
    width: 100%;
    text-align: center;
    transition: all 0.3s linear;
    overflow: auto;
    position: relative;

    i {
      margin: 0 5px;
      color: #514960;
      font-size: 28px;
    }
    p{
      display: inline-block;
      font-size: 12px;
      margin: 0px;
      padding: 0px;
      font-weight: 400px;
      color: #666666;
      width: 100%;
      font-weight: 300;
      text-align: center;
    }

    &:hover{
      border: 1px solid #888888;

      p{
        color: #333333;
      }
    }

    .component-item-description {
      float: left;
      margin-left: 20px;
      width: 90%;
    }

    .draggable-icon {
      float: left;
      top: 50%;
      transform: translateY(-50%);
      position: absolute;
      left: 5px;
      color: #808080;
    }

    .component-item-id {
      position: relative;
      text-align: left;
      i {
        margin: 0px;
        font-size: 10px;
      }
    }

    .component-item-name {
      padding-left: 14px;
    }
  }

  .sub-component-item{
    cursor: pointer;
    list-style-type: none;
    font-size: 14px;
    background-color: #f4f4f4;
    border: 1px solid #d8d8d8 !important;
    padding: 8px;
    width: 100%;
    margin-right: 4px;
    margin-bottom: 4px;
    text-align: center;
    transition: all 0.3s linear;

    i {
      margin: 0 5px;
      color: #514960;
      font-size: 28px;
    }
    p{
      display: inline-block;
      font-size: 12px;
      margin: 0px;
      padding: 0px;
      font-weight: 400px;
      color: #666666;
      width: 100%;
      font-weight: 300;
      text-align: center;
    }

    &:hover{
      border: 1px solid #888888;

      p{
        color: #333333;
      }
    }
  }
}

.sub-menu{
  width: 50%;
}
</style>

