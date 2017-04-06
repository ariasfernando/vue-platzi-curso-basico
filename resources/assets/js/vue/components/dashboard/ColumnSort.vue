<template>
  <a href="#" v-on:click.stop.prevent="sortBy(field)">
    {{ title }}
        <i class="glyphicon pull-right" v-bind:class="sortClass"></i>
  </a>
</template>

<script>
  export default {
    props: ['field', 'title', 'sort', 'reverse'],
    computed: {
      sortClass: function () {
        return {
          'glyphicon-triangle-bottom': this.sort === this.field,
          'glyphicon-triangle-top': this.sort === this.field ? this.reverse : false
        }
      }
    },
    methods: {
      sortBy: function (field) {
        this.$emit('change-sort', field);
      }
    }
  }
</script>