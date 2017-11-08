<template>
  <a href="#" v-on:click.stop.prevent="sortBy(field)">
    {{title}}
    <i class="glyphicon pull-right" v-bind:class="sortClass"></i>
  </a>
</template>

<script>
  export default {
    computed: {
      sortClass: function() {
        return {
          'glyphicon-menu-down': this.sort === this.field,
          'glyphicon-menu-up': this.sort === this.field ? this.reverse : false
        }
      }
    },
    props: ['field', 'title', 'sort', 'reverse'],
    methods: {
      sortBy: function(field) {
        this.$emit('change-sort', field);
      }
    }
  }
</script>