<?php
    $module_params = $app_config["modules"]["image_plus_text_flipped"];

    // Module Params
    if( !isset($module_params['data']) ){
        $module_params['data'] = (isset($module['data']))? $module['data']:'';
    }

    if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
        $image = $module_params['data']['image0'];
    }
?>
<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
    <td align="left" valign="top" class="st-add-icon-config mobile-margin">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr class="posRel h307">
                    <td width="50%" align="left" valign="top" class="element-block-center">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td width="28" align="left" valign="top" class="hidden-device"></td>
                                    <td align="left" valign="top">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr><td width="23" align="left" valign="top"></td></tr>
                                                <tr><td height="20" align="left" valign="top"></td></tr>
                                                <tr>
                                                    <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#333333; font-weight:bold; line-height:17px; -webkit-text-size-adjust:none;" class="st-save-only-text" contenteditable="true">
                                                        @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                                            {!! $module_params['data']['text0'] !!}
                                                        @else
                                                            Nulligni dolorio.
                                                        @endif
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#333333; font-weight:normal; line-height:17px; -webkit-text-size-adjust:none; padding-right:28px;" class="st-save-only-text" contenteditable="true">
                                                        @if ( isset($module_params['data']['text1']) && !empty($module_params['data']['text1']) )
                                                            {!! $module_params['data']['text1'] !!}
                                                        @else
                                                            Arum is modis as aute lit volupta usndunt labo.&nbsp;Vid earum acidignatur quid ut exceue qui&nbsp;doleste.
                                                        @endif
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="6" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:6px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#333333; font-weight:normal; line-height:15px; -webkit-text-size-adjust:none; padding-right:28px;" class="st-save-only-text" contenteditable="true">
                                                        @if ( isset($module_params['data']['text2']) && !empty($module_params['data']['text2']) )
                                                            {!! $module_params['data']['text2'] !!}
                                                        @else
                                                            Arum is modis as aute lit&nbsp;volupta.
                                                        @endif
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td height="7" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:7px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#0066CC; font-weight:normal; line-height:17px; -webkit-text-size-adjust:none;">
                                                        <a
                                                            href="{{ isset($module_params['data']['link0'])? $module_params['data']['link0'] : ' ' }}"
                                                            class="st-without-event st-link-target st-validate-href"
                                                            target="_blank"
                                                            style="color:#0066CC; line-height:17px; text-decoration:underline; font-weight:normal;">
                                                            <span
                                                                style="color:#0066CC; line-height:17px; text-decoration:underline; font-weight:normal;"
                                                                class="st-save-only-text st-inline-block"
                                                                contenteditable="true">
                                                                @if ( isset($module_params['data']['text3']) && !empty($module_params['data']['text3']) )
                                                                    {!! $module_params['data']['text3'] !!}
                                                                @else
                                                                    Primary text link
                                                                @endif
                                                            </span>
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr><td height="20" align="left" valign="top"></td></tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td width="5" align="left" valign="top" class="hidden-device"></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td width="50%" align="center" valign="top" class="element-block-center">
                        <a
                            href="#"
                            target="_blank"
                            data-master-image-editor="image_plus_text"
                            style="display:inline-block;">
                            @if ( isset($image['path']) && !empty($image['path']) )
                                {!! Html::image( url() . "/images/campaigns". $image['path'],
                                    ( isset($image['alt']) )? $image['alt']:'',
                                    array(
                                        'title' => ( isset($image['alt']) )? $image['alt']:'',
                                        'border' => '0',
                                        'data-image' => '',
                                        'style' => 'display:block;border:none;max-width:318px;width:100%;'
                                    ))
                                !!}
                            @else
                                {!! Html::image( url() . $module_params['placeholder_image'],
                                    'hero-area-three',
                                    array(
                                        'title' => 'image-text',
                                        'border' => '0',
                                        'data-image' => '',
                                        'style' => 'display:block;border:none;max-width:318px;width:100%;'
                                    )) 
                                !!}
                            @endif
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </td>
</tr>