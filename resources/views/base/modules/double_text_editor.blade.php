<?php
    $module_params = $app_config["modules"]["double_text_editor"];

    // Module Params
    if( !isset($module_params['data']) ){
        $module_params['data'] = (isset($module['data']))? $module['data']:'';
    }
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
    <td>
        <table bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
            <tr>
                <td style="padding:0px 40px 50px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">  
                        <tr>
                            <td>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">   
                                    <tr>
                                        <td width="100%" valign="middle" align="left" class="st-save-only-text" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:25px;font-weight:bold;line-height:30px;margin:0;color:#000000;padding:0;text-align:center;">
                                            <div class="text-overlay st-title-text-overlay">
                                                <div class="prevent-overflow">
                                                    <div id="text-editable" class="st-edit-text st-title-text">
                                                        <div>
                                                            @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                                                {!! $module_params['data']['text0'] !!}
                                                            @else                                       
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="text-overlay-toolbox"></div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td height="10" style="line-height:10px !important;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="100%" valign="middle" align="left" class="st-save-only-text" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:16px;font-weight:normal;line-height:26px;margin:0;color:#666666;text-align:center;">
                                            <div class="text-overlay st-sutbitle-text-overlay">
                                                <div class="prevent-overflow">
                                                    <div class="st-edit-text st-subtitle-text">
                                                        <div>
                                                            @if ( isset($module_params['data']['text1']) && !empty($module_params['data']['text1']) )
                                                                {!! $module_params['data']['text1'] !!}
                                                            @else
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempus, lacus et vehicula congue, felis diam rhoncus enim, a scelerisque sapien nulla non tortor. Mauris aliquet accumsan lorem, eget blandit diam pretium at.
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="text-overlay-toolbox"></div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>