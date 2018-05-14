<template>
  <div class="plugin-wrapper-inner">
    <label>{{ plugin.title }}</label>

    <div class="alignment-options">
      <a data-tooltip="Top" :class="{ 'plugin-setting-active': value === 'top' }" @click="change('top')"><i class="glyphicon glyphicon-object-align-top"></i></a>
      <a data-tooltip="Middle" :class="{ 'plugin-setting-active': value === 'middle' }" @click="change('middle')"><i class="glyphicon glyphicon-object-align-horizontal"></i></a>
      <a data-tooltip="Bottom" :class="{ 'plugin-setting-active': value === 'bottom' }" @click="change('bottom')"><i class="glyphicon glyphicon-object-align-bottom"></i></a>
    </div>

  </div>
</template>

<script>
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
        return this.column.container.attribute.valign;
      }
    },
    data() {
      return {
        options: this.plugin.config.options
      }
    },
    methods: {
      change(val) {
        const payload = {
          plugin: this.name,
          moduleId: this.moduleId,
          columnId: this.columnId,
          attribute: 'valign',
          attributeValue: val,
        };

        this.$store.commit('campaign/saveColumnAttribute', payload);
      }
    },
  }
</script>