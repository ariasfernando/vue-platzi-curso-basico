<template id="greeter">
    <section class="campaign-preview section-box">
        <!-- content canvas email -->
        <div class="section-box-content section-canvas-container">
            <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
                        <table id="emailCanvas" class="stx-email-canvas wrapper-table" width="{{ $params['campaign_data']->getLibraryConfig('template_width') }}" cellspacing="0" cellpadding="0" border="0">
                            <tbody>
                                {!! $params['campaign_data']->body_html !!}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                name: 'Laracasts'
            };
        }
    };
</script>

<style>
    .campaign-preview {

    }
</style>
