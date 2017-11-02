<template>
  <div class="plugin-wrapper-inner">
    <label>{{ plugin.title }}</label>

    <div class="alignment-options">
      <a data-tooltip="Top"><i class="glyphicon glyphicon-object-align-top"></i></a>
      <a data-tooltip="Middle"><i class="glyphicon glyphicon-object-align-horizontal"></i></a>
      <a data-tooltip="Bottom" class="plugin-setting-active"><i class="glyphicon glyphicon-object-align-bottom"></i></a>
    </div>
    
    <!--
    <select title="vertical-alignment" name="alignment" :value="value" @change="change">
      <option v-for="option in options" :value="option" :selected="option === value">{{ option }}</option>
    </select>
    -->
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    props: ['name', 'plugin', 'moduleId', 'columnId'],
    computed: {
      modules() {
        return this.$store.getters["campaign/modules"];
      },
      column() {
        return this.modules[this.moduleId].structure.columns[this.columnId];
      },
      value() {
        return this.column.attribute.valign;
      }
    },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    methods: {
      change(e) {
        const payload = {
          plugin: this.name,
          moduleId: this.moduleId,
          columnId: this.columnId,
          attribute: 'valign',
          attributeValue: e.target.value,
        };

        this.$store.commit('campaign/saveColumnAttribute', payload);
      }
    },
  }
</script>