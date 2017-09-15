<template>
  <div :id="'container-' + id" class="modal-mpf-row">
    <label class="switch-light switch-stensul" onclick="">
      <input type="checkbox" :id="id" checked="checked">
      <span>{{ label || 'Show overlay' }}<span>Off</span><span>On</span></span>
      <a></a>
    </label>
  </div>
</template>

<script>
  export default {
    props: ['id', 'label']
  }
</script>