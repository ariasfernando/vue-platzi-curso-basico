<?php

    $buttonData = [
        'visibility' => isset($module_params['data']['btn_visibility']) ? $module_params['data']['btn_visibility'] : null,
        'destination_url' => isset($module_params['data']['btn_destination_url']) ? $module_params['data']['btn_destination_url'] : null,
        'background_color' => isset($module_params['data']['btn_background_color']) ? $module_params['data']['btn_background_color'] : null,
        'font_color' => isset($module_params['data']['btn_font_color']) ? $module_params['data']['btn_font_color'] : null,
        'text' => isset($module_params['data']['text1']) ? $module_params['data']['text1'] : null   
    ];
    
    // Set Default Image Button.
    $buttonDataDefault = [
        'source' => isset($module_params['placeholder_image_button'])? url(str_replace('{locale}', $params["campaign_data"]["locale"]), $module_params['placeholder_image_button']): '',
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

    $image_path = url($module_params['placeholder_image']);
    if ( isset($image['path']) && !empty($image['path']) ) {
        $image_path = url("/images/campaigns". $image['path']);
    }
?>

{{-- Image With Text: Start --}}
<tr data-params='{{json_encode($module_params)}}' class="moduleTarget">
    {{-- dir=ltr is where the magic happens. This can be changed to dir=rtl to swap the alignment on wide while maintaining stack order on narrow. --}}
    <td dir="ltr" bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%">

        <!--[if (mso)|(IE)]>
            <table border="0" cellspacing="0" cellpadding="0" align="center" width="660">
                <tr>
                    <td align="center" valign="top" width="660">
        <![endif]-->

        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:660px;">
            <tbody><tr>
                <td align="center" valign="top" style="font-size:0; padding: 10px 0;">

                    <!--[if (mso)|(IE)]>
                        <table border="0" cellspacing="0" cellpadding="0" align="center" width="660">
                            <tr>
                                <td align="left" valign="top" width="220">
                    <![endif]-->

                    <div style="display:inline-block; margin: 0 -2px; max-width: 220px; min-width:160px; vertical-align:top; width:100%;" class="stack-column">
                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tbody><tr>
                                <td dir="ltr" style="padding: 10px 10px 10px 0px;">
                                    <a href="{{ $image['destination_url'] or '#' }}" target="_blank" data-modal-config="image_height_adjustable" data-master-image-editor="text_with_image" class="st-without-event">
                                        {!! Html::image( $image_path, isset($image['alt']) ? $image['alt'] : '', array(
                                            'title' => ( isset($image['alt']) ) ? $image['alt']:'',
                                            'align' => 'center',
                                            'width' => 220,
                                            'class' => 'center-on-narrow',
                                            'style' => 'border: 0; width: 100%; max-width: 220px; height: auto'
                                        )) !!}
                                    </a>
                                </td>
                            </tr>
                        </tbody></table>
                    </div>

                    <!--[if (mso)|(IE)]>
                                </td>
                                <td align="left" valign="top" width="440">
                    <![endif]-->

                    <div style="display:inline-block; margin: 0 -2px; max-width: 440px; min-width:320px; vertical-align:top;" class="stack-column">
                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tbody><tr>
                                <td align="left" dir="ltr" style="font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555; padding: 10px; text-align: left;" class="center-on-narrow">
                                    <div class="text-overlay" style="margin-bottom: 10px">
                                        <div class="prevent-overflow">
                                            <div id="text-editable" class="st-edit-text" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size:12px; color:#333; line-height:18px; text-align:justify; font-weight:normal;margin:0px;padding:0px;">
                                                @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                                                    {!! $module_params['data']['text0'] !!}
                                                @else
                                                    <strong style="color:#111111;">Class aptent taciti sociosqu</strong>
                                                    <br>
                                                    Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                                                    <br>
                                                @endif
                                            </div>
                                        </div>
                                        <div class="text-overlay-toolbox"></div>
                                    </div>

                                    {{-- Button : Begin --}}
                                    <table cellspacing="0" cellpadding="0" border="0" class="center-on-narrow" align="left" style="text-align: left; margin-top: 10px !important; display:{{ $buttonData['visibility'] == 'false' ? 'none' : 'table' }} !important">
                                        <tbody><tr>
                                            <td class="st-btn button-td"
                                                style="border-radius: 3px; background: {{ $buttonData['background_color'] or $module_params['button']['background_colors']['default'] }}; text-align: center;">
                                                <a  href="{{ $buttonData['destination_url'] or '#' }}" class="button-a st-without-event st-cta-button"
                                                    style="background: {{ $buttonData['background_color'] or $module_params['button']['background_colors']['default'] }}; border: 15px solid {{ $buttonData['background_color'] or $module_params['button']['background_colors']['default'] }}; font-family: sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;">

                                                    <span class="st-save-only-text st-content-editable-single-line" style="color: {{ $buttonData['font_color'] or $module_params['button']['font_colors']['default'] }}"
                                                          contenteditable="true" truncate="50">{{ $buttonData['text'] or "CTA Button" }}</span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                    {{-- Button : END --}}
                                </td>
                            </tr>
                        </tbody></table>
                    </div>

                    <!--[if (mso)|(IE)]>
                                </td>
                            </tr>
                        </table>
                    <![endif]-->

                </td>
            </tr>
        </tbody></table>
        <!--[if (mso)|(IE)]>
                    </td>
                </tr>
            </table>
        <![endif]-->
    </td>
</tr>
{{-- Image With Text: End --}}
