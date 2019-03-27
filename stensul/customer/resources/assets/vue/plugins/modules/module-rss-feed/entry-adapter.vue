<template>
  <div class="entry">
    <div class="title">{{ entry.title }}</div>
    <div class="description">{{ entry.description }}</div>
    <div class="link">{{ entry.link }}</div>
    <div class="creator">By {{ entry['dc:creator'] }}, {{ entry.pubDate }} </div>
  </div>
</template>

<script>
export default {
  props: [
    'entry'
  ]
}
</script>

<style lang="less" scoped>
  .entry {

    .title {
      font-size: 110%;
      font-weight: bold;
      padding-bottom: 6px;
    }

    .link {
      padding: 12px;
      font-style: italic;
    }

    .creator {
      padding: 3px 0;
      text-align: right;
    }
  }
</style>
