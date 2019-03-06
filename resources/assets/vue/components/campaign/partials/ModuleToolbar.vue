<template>
  <div class="module-toolbar">
    <div v-if="!campaign.locked && !module.mandatory" class="icon-remove" @click.stop="remove">
      <i class="fa fa-trash-o" />
    </div>
    <div v-if="hasConfig" class="icon-config" @click.stop="config">
      <i class="fa fa-cogs" />
    </div>
    <div v-if="!campaign.locked && !module.isFixed" class="icon-clone" @click.stop="clone">
      <i class="fa fa-clone" />
    </div>
    <div v-if="!campaign.locked && !module.isFixed" class="icon-move">
      <i class="fa fa-arrows" />
    </div>
  </div>
</template>

<script>
import ModuleListMixin from '../mixins/moduleListMixin';

export default {
  name: 'ModuleToolbar',
  mixins: [ModuleListMixin],
  props: ['moduleId'],
  computed: {
    campaign() {
      return this.$store.getters['campaign/campaign'].campaign_data;
    },
    module() {
      return this.$store.getters['campaign/modules'][this.moduleId];
    },
    hasConfig() {
      let hasConfig = false;
      _.each(this.module.plugins, (plugin) => {
        if (plugin.enabled === true && plugin.runBackground !== true) {
          hasConfig = true;
        }
      });
      if (this.module.structure) {
        _.each(this.module.structure.rows[0].columns, (column) => {
          _.each(column.plugins, (plugin) => {
            if (plugin.enabled === true) {
              hasConfig = true;
            }
          });
        });
      }
      if (this.module.type === 'custom' && 'hasConfig' in this.module) {
        hasConfig = this.module.hasConfig;
      }
      return hasConfig;
    },
  },
  methods: {
    config() {
      this.$store.commit('campaign/unsetCurrentElement');
      this.$store.commit('campaign/setCurrentModuleIdInstance', this.module.idInstance);
      this.$store.commit('campaign/setShowModuleSettings', true);
      this.$store.commit('campaign/unsetCurrentCustomComponent');
    },
    clone() {
      this.addModule(this.module, this.moduleId + 1);
    },
    remove() {
      this.$store.dispatch('campaign/removeModule', this.moduleId);
      this.$store.commit('campaign/unsetCurrentElement');
    },
  },
};
</script>

<style lang="less">
@focus: #69dac8;
.stx-module-wrapper:hover {
  &::before {
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: block;
    outline: 2px solid #c0dfda;
    outline-offset: -1px;
  }
  .module-toolbar {
    background: #c0dfda;
  }
  .module-overlay {
    pointer-events: none;
    position: absolute;
    background: rgba(65, 168, 152, 0.1);
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: block;
    outline: 2px solid #c0dfda;
    outline-offset: -1px;
    z-index: 299;
  }
  .icon-move {
    display: inline-block;
  }
  .icon-remove,
  .icon-clone,
  .icon-config {
    display: none;
  }
}
.stx-module-wrapper-active {
  &::before {
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: block;
    outline: 2px solid @focus;
    outline-offset: -1px;
  }
  .module-overlay {
    pointer-events: none;
    position: absolute;
    background: none;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: block;
    outline: 2px solid @focus;
    outline-offset: -1px;
    z-index: 298;
  }
  .icon-move,
  .icon-remove,
  .icon-clone,
  .icon-config {
    display: inline-block;
  }
  &:hover {
    .module-overlay {
      outline: 2px solid @focus;
      outline-offset: -1px;
      background: none;
      z-index: 299;
    }
    .module-toolbar {
      background-color: #69dac8;
    }
    .icon-move,
    .icon-remove,
    .icon-clone,
    .icon-config {
      display: inline-block;
    }
  }
}
.stx-position-relative {
  position: relative;
}
.module-toolbar {
  position: absolute;
  background-color: #69dac8;
  height: 30px;
  top: -30px;
  right: 0px;
  div {
    cursor: pointer;
    display: none;
    text-align: center;
    color: #fff;
    z-index: 5;
    height: 30px;
    width: 30px;
    line-height: 30px;
    opacity: 1;
  }
  .icon-move {
    cursor: move;
    cursor: -webkit-grabbing;
  }
}
</style>
