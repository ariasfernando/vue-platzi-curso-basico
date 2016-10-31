<?php
    $module_params = $app_config["modules"]["text_with_image"];
    $module_params['data'] = (isset($module['data']))? $module['data']:'';

    $buttonData = [
        'visibility' => isset($module_params['data']['btn_visibility']) ? $module_params['data']['btn_visibility'] : null,
        'destination_url' => isset($module_params['data']['btn_destination_url']) ? $module_params['data']['btn_destination_url'] : null,
        'background_color' => isset($module_params['data']['btn_background_color']) ? $module_params['data']['btn_background_color'] : null,
        'font_color' => isset($module_params['data']['btn_font_color']) ? $module_params['data']['btn_font_color'] : null,
        'text' => isset($module_params['data']['text1']) ? $module_params['data']['text1'] : null   
    ];
    
    // Set Default Image Button.
    $buttonDataDefault = [
        'source' => isset($module_params['placeholder_image_button'])? url() . str_replace('{locale}', $params["campaign_data"]["locale"], $module_params['placeholder_image_button']): '',
        'alt' => 'image-button'
    ];

    $buttonDataDefault['attr'] = [
        'title' => $buttonDataDefault['alt'],
        'border' => '0',
        'height' => '40',
        'style' => 'display:block;max-width:100%;max-height:100%;border:none;'
    ];

    // Set Image.
    $image = [];
    if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
        $image = $module_params['data']['image0'];
    }
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>' class="moduleTarget">
    <td
        align="left"
        valign="top"
        bgcolor="#FFFFFF"
        style="background-color:#FFFFFF;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    
                    <th align="left" valign="top" class="element-block-center">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td align="left" valign="top" style="padding-right: 15px;padding-left: 15px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td height="7" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:7px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                                </tr>
                                                <tr>
                                                    <td align="left" valign="top">
                                                        <div class="text-overlay">
                                                            <div class="prevent-overflow">
                                                                <div id="text-editable" class="st-edit-text" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size:12px; color:#333; line-height:18px; text-align:justify; font-weight:normal;margin:0px;padding:0px;">
                                                                    @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                                                        {!! $module_params['data']['text0'] !!}
                                                                    @else
                                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim consequat congue. Duis suscipit, lorem eget ornare vulputate, sem purus hendrerit eros, eu scelerisque arcu libero auctor nulla. </br>
                                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim consequat congue. Duis suscipit, lorem eget ornare vulputate, sem purus hendrerit eros, eu scelerisque arcu libero auctor nulla.
                                                                    @endif
                                                                </div>
                                                            </div>
                                                            <div class="text-overlay-toolbox"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="st-separate-text" height="10" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:10px;">
                                        <!--[if gte mso 15]>&nbsp;<![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" valign="top" style="padding: 10px 15px;display:{{ $buttonData['visibility'] == 'false' ? 'none' : 'inline-block' }}">
                                        <table class="btn" align="left" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt; mso-table-rspace:0pt;padding:0;">
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="st-btn"
                                                        height="40"
                                                        valign="middle"
                                                        bgcolor="{{ $buttonData['background_color'] or $module_params['button']['background_colors']['default'] }}"
                                                        style="background-color:{{ $buttonData['background_color'] or $module_params['button']['background_colors']['default'] }};font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:20px;line-height:25px; border-collapse:separate; -moz-border-radius:4px; -webkit-border-radius:4px; -o-border-radius:4px; border-radius:4px; -webkit-box-shadow:0 2px 8px rgba(0,0,0,0.5); -moz-box-shadow:0 2px 8px rgba(51,51,51,0.5); -o-box-shadow:0 2px 8px rgba(0,0,0,0.5); box-shadow:0 2px 8px rgba(0,0,0,0.5);font-weight:normal;">
                                                            <!--[if mso]>&nbsp;<![endif]-->
                                                            <a
                                                                target="_blank"
                                                                class="st-without-event st-cta-button"
                                                                href="{{ $buttonData['destination_url'] or '#' }}"
                                                                style="text-decoration:none;display:block;padding:10px;">
                                                                    <span
                                                                        style="color:{{ $buttonData['font_color'] or $module_params['button']['font_colors']['default'] }};"
                                                                        contenteditable="true"
                                                                        truncate="50"
                                                                        class="st-save-only-text st-content-editable-single-line">{{ $buttonData['text'] or "CTA Button" }}</span>
                                                            </a>
                                                            <!--[if mso]>&nbsp;<![endif]-->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </th>
                    <th align="center" valign="top" class="element-block-center" style="padding-right: 15px">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td height="7" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:7px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                </tr>
                                <tr>
                                    <td align="center" valign="top" >
                                        <a href="{{ $image['destination_url'] or '#' }}"
                                            target="_blank"
                                            data-modal-config="image_height_adjustable"
                                            data-master-image-editor="text_with_image"
                                            class="st-without-event"
                                        >
                                            @if ( isset($image['path']) && !empty($image['path']) )
                                                {!! Html::image( url('/') . "/images/campaigns". $image['path'],
                                                    ( isset($image['alt']) )? $image['alt']:'',
                                                    array(
                                                        'title' => ( isset($image['alt']) )? $image['alt']:'',
                                                        'border' => '0',
                                                        'width' => ( isset($image['background_width']) )? $image['background_width']:'',
                                                        'height' => ( isset($image['background_height']) )? $image['background_height']:'',
                                                        'class' => 'st-adjustable-size',
                                                        'style' => 'display:block;border:none;'
                                                    ))
                                                !!}
                                            @else
                                                {!! Html::image( url('/') . $module_params['placeholder_image'],
                                                    'content-module-3',
                                                    array(
                                                        'title' => 'content-module-3',
                                                        'border' => '0',
                                                        'class' => 'st-adjustable-size',
                                                        'style' => 'display:block;border:none;'
                                                    ))
                                                !!}
                                            @endif
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="7" width="100%" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; mso-line-height-rule:exactly; line-height:7px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td>
                                </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
            </tbody>
        </table>
    </td>
</tr>