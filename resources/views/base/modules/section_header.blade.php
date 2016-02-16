<!-- Body Single -->
<?php
$module_params = $app_config["modules"]["section_header"];

// Module Params
if( !isset($module_params['data']) ){
    $module_params['data'] = (isset($module['data']))? $module['data']:'';
}

$background_color = ( isset($module_params['background_colors']['default']) )? $module_params['background_colors']['default'] : '';
if( isset($module_params['data']['background_color']) ){
    $background_color = $module_params['data']['background_color'];
}

?>
<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
    <td class="st-add-icon-config" bgcolor="{{ $background_color }}" style="background-color: {{ $background_color }};">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
                <td width="28" align="left" valign="top" class="hidden-device"></td>
                <td align="left" valign="top" class="mobile-margin">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td valign="middle" align="left" class="st-save-only-text" contenteditable="true" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size: 16px; color:#000; font-weight: bold; line-height:20px">
                                @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                    {!! $module_params['data']['text0'] !!}
                                @else
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur nunc sed dolor ornare lobortis
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