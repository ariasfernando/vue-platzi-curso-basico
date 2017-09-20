<template>
  <table width="100%" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="vertical-align:middle;">
        <table style="width:100%!important;" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align:top;" valign="top" align="center" bgcolor="#ffffff">
              <a :href="module.data.href || module.params.href" data-key="image0" data-open-element-config="hero_image">
                <img :src="module.data.imageSrc || module.params.imagePlaceholder"
                     :alt="module.data.imageAlt || ''" :title="module.data.imageAlt || ''"
                     width="100%" border="0" class="full-width"
                     style="display:block; border:none; max-width:100%; height:auto;">
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    props: ['moduleId'],
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      }
    },
    data () {
      return {}
    },
  }
</script>

<style lang="less">

</style>