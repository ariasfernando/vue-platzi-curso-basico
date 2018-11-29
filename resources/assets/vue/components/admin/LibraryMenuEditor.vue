<template>
  <div class="simple-text-config admin-library-form">
    <div class="row">
      <div class="col-md-6">
        <p>
          <label for="name">Add module:</label>
          <el-autocomplete
            v-model="state"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="Please Input"
            @select="handleSelect" />
          |
          <button class="btn btn-success btn-add-group" @click.prevent="addGroup">Add Group</button>
        </p>
      </div>
      <div class="col-md-6">
        <label for="name">Menu</label>
        <div id="modules-container">
          <draggable v-model="library.modules" class="drag-component-menu components-list" :options="{group:'menuList'}">
            <div v-for="(group, idx) in library.modules" :id="'modules-' + group.name" :key="idx">
              <div v-if="group.type == 'sub-menu'" :id="'group-container-' + group.name">
                <p :class="{ 'control': true }">
                  <input v-model="group.name" v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('groupName-' + idx) }"
                         :name="'modules[' + idx + '][name]'" type="text" placeholder="Enter group name">
                  <span v-show="errors.has('groupName-' + idx)"
                        class="help is-danger">{{ errors.first('groupName-' + idx) }}</span>
                </p>
                <draggable v-model="group.modules" class="drag-component-menu" :options="{group:'menuList'}" @add="onAdd">
                  <template v-for="(module, idx) in group.modules">
                    <el-tooltip :key="idx" class="item" effect="light" placement="left">
                      <div slot="content">ID: {{ module.moduleId }}</div>
                      <li class="component-item list-group-item">
                        <input v-model="module.name" v-validate="'required'"
                               :class="{'input': true, 'menu-item' : true }" type="text" placeholder="Enter module name">
                        <span class="glyphicon glyphicon-trash item-remove" @click="deleteItem(group.modules,idx)" />
                      </li>
                    </el-tooltip>
                  </template>
                </draggable>
                <div class="group-remove-container">
                  <span class="glyphicon glyphicon-trash group-remove" @click.prevent="deleteGroup(idx)" />
                  <hr/>
                </div>
              </div>
              <el-tooltip class="item" effect="light" placement="left">
                <div slot="content">ID: {{ group.moduleId }}</div>
                <li v-if="group.type == 'item'" class="component-item list-group-item">
                  <input v-model="group.name" v-validate="'required'"
                         :class="{'input': true , 'menu-item' : true }" type="text" placeholder="Enter module name">
                  <span class="glyphicon glyphicon-trash item-remove" @click="deleteItem(library.modules,idx)" />
                </li>
              </el-tooltip>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- Field fixed modules" -->
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
      let cloneItem = e.item;
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
      let modules = this.modules;
      let results = queryString ? modules.filter(this.createFilter(queryString)) : modules;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) {
      return (module) => {
        return (module.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.addItem(item.value);
      this.state = '';
    },
    addItem(moduleId) {
      const itemData = {
        name: moduleId,
        moduleId,
        type: 'item',
      };
      this.library.modules.push(itemData);
    },
  },
};
</script>
<style lang="scss" scoped>
.preview-module-container {
  min-height: 206px;
  background: #f0f0f0;
}
.mt-20{
  margin-top: 20px;
}
.settings-container /deep/ label{
  font-weight: 600;
}
.group-remove-container {
  width: 50%;
  text-align: right;
}

.group-remove {
  float: none !important;
  margin-top: 10px;
}

.item-remove {
  float: right;
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
  min-height: 30px;
  margin-left: 30px;

  input{
    width: 50% !important;
  }

  hr{
    margin-top: 3px;
    margin-bottom: 10px;
  }

  .menu-item{
    width: 80% !important;
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
    background-color: #f4f4f4;
    border: 1px solid #d8d8d8 !important;
    padding: 8px;
    width: 47%;
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

