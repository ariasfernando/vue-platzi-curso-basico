<!-- Header Line of Text, plus body -->
<?php
    $module_params = $app_config["modules"]["header_text_with_body"];

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
    <td align="left" valign="top" bgcolor="<?php echo $background_color; ?>" style="background-color: <?php echo $background_color; ?>;" class="st-add-icon-config mobile-margin">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td width="28" align="left" valign="top" class="hidden-device"></td>
                    <td align="left" valign="top">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                            <tr>
                                <td width="23" align="left" valign="top"></td>
                            </tr>
                            <tr>
                                <td height="20" align="left" valign="top"></td>
                            </tr>
                            <tr>
                                <td align="left" valign="top" class="st-save-only-text" contenteditable="true" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size:18px; color:#333333; font-weight:bold; line-height:22px; -webkit-text-size-adjust:none;">
                                    @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                        {!! $module_params['data']['text0'] !!}
                                    @else
                                        Nulligni dolorio.
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td align="left" valign="top" class="st-save-only-text" contenteditable="true" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size:16px; color:#333333; font-weight:normal; line-height:20px; -webkit-text-size-adjust:none; padding-right:28px;">
                                    @if ( isset($module_params['data']['text1']) && !empty($module_params['data']['text1']) )
                                        {!! $module_params['data']['text1'] !!}
                                    @else
                                        Arum is modis as aute lit volupta usndunt labo. Vid earum acidignatur quid ut exceue qui dolesteerior rem facit apienim agnissequo que et vollace sequisque essedit ut laces susdam.
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td height="24" align="left" valign="top"></td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                    <td width="28" align="left" valign="top" class="hidden-device"></td>
                </tr>
            </tbody>
        </table>
    </td>
</tr>