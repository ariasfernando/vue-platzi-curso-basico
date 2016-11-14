<!-- Body Single -->
<?php

$background_color = ( isset($module_params['background_colors']['default']) )? $module_params['background_colors']['default'] : '';
if( isset($module_params['data']['background_color']) ){
    $background_color = $module_params['data']['background_color'];
}

?>
<tr data-params='{{json_encode($module_params)}}'>
    <td class="st-add-icon-config" bgcolor="{{ $background_color }}" style="background-color: {{ $background_color }};">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
                <td width="28" align="left" valign="top" class="hidden-device"></td>
                <td align="left" valign="top" class="mobile-margin">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td valign="middle" align="left" class="st-save-only-text" contenteditable="true" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size: 36px; color:#000; font-weight: bold; line-height:38px; height:70px; text-align: center;">
                                @if ( !empty($module_params['data']['text0']) )
                                    {!! $module_params['data']['text0'] !!}
                                @else
                                    Lorem ipsum
                                @endif
                            </td>
                        </tr>
                    </table>
                </td>
                <td width="28" align="left" valign="top" class="hidden-device"></td>
            </tr>
        </table>
    </td>
</tr>