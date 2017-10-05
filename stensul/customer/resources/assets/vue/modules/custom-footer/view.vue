<template>
  <div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" valign="top" style="vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" class="module-table-wrapper">
            <tr>
              <td align="center" style="padding:0 20px;" bgcolor="#ffffff">
                <table
                  style="max-width:600px;margin-left:0;margin-bottom:0;margin-right:0;margin-top:0;padding-left:0;padding-bottom:0;padding-top:0;padding-right:0;background-color:#ffffff;font-weight:normal;font-size:13px;line-height:18px;color:#666666;text-align:left;"
                  :style="{ fontFamily: campaign.library_config.fontFamily }"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  align="center"
                  bgcolor="#ffffff"
                >
                  <tr>
                    <td contenteditable="true" style="line-height:19px; color:#bbbebf; font-size:12px; font-weight: 400; padding:20px 0;">
                      {{ module.data.text }}
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <modal :module-id="moduleId"></modal>
  </div>
</template>

<script>

  import Modal from './modal.vue';

  export default {
    props: ['moduleId'],
    components: {
      Modal
    },
    computed: {
      module() {
        return this.$store.getters["campaign/modules"][this.moduleId];
      },
      campaign() {
        return this.$store.getters["campaign/campaign"];
      }
    },
    data () {
      return {}
    },
  }
</script>

<style lang="less">

</style>