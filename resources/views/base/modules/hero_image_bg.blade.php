<?php

    if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
        $image = $module_params['data']['image0'];
    }

    if ( isset($image['background_image']) && !empty($image['background_image']) ){
        $bg_image_src = url('/') . '/images/campaigns'. $image['background_image'];
    }else{
        $bg_image_src = url('/') . $module_params['placeholder_image'];
    }
?>

<tr data-params='{{json_encode($module_params)}}'>
    <td align="center" style="padding-bottom:10px;" class="st-add-icon-config">
        <table width="100%" height="400" cellpadding="0" cellspacing="0">
            <tbody>
                <tr>
                    <td
                        class="st-background-target"
                        align="left"
                        valign="middle"
                        bgcolor="#ffffff"
                        style="background:no-repeat center top / cover;background-image:url('{{ $bg_image_src }}');">
                        <!-- this comment will be rewritten by js -->
                        <!-- background for outlook 2007 windows and newer-->
                        <!--[if gte mso 9]>
                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:640px;height:400px;background-repeat:no-repeat; background-position:center top;">
                        <v:fill src="{{ $bg_image_src }}" color="#ffffff" type="frame" />
                        <v:textbox style="mso-fit-shape-to-text:true; text-align:center;" inset="0,0,0,0">
                        <![endif]-->

                        <table width="100%" height="400" cellpadding="0" cellspacing="0" align="center">
                            <tbody>
                                <tr>
                                    <td align="center" valign="bottom" height="400">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <td align="center" valign="top" style="padding-top:0;padding-bottom:0;">
                                                        @if ( !empty($module_params['data']['text0']) )
                                                            {!! $module_params['data']['text0'] !!}
                                                        @else
                                                            <h1
                                                                contenteditable="true"
                                                                style="margin-top:0;margin-bottom:8px;font-size:30px;line-height:30px;color:#ffffff;font-weight:bold;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-shadow:1px 1px #444444;padding-left:15px;padding-right:15px;">LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.</h1>
                                                        @endif
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <td align="center" style="padding-bottom:10px;padding-top:10px">
                                                        <table border="0" cellspacing="0" cellpadding="0" style="background-color:#ff5a5f;" class="mso-side-padding-20">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="center" valign="middle" height="35">

                                                                        <a
                                                                            href="{{ isset($module_params['data']['button0']['link'])? $module_params['data']['button0']['link'] : '#' }}"
                                                                            target="_blank"
                                                                            contenteditable="true"
                                                                            class="st-save-only-text st-content-editable-single-line st-button0"
                                                                            style="white-space:nowrap;display:block!important;height:35px;line-height:35px!important;font-size:18px;color:#ffffff;font-weight:600;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};letter-spacing:.35px; text-decoration:none;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;padding-left:20px;padding-right:20px;max-width:600px;"
                                                                            >{{ !empty($module_params['data']['text1']) ? $module_params['data']['text1'] : "Primary Button" }}</a>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    <!--[if gte mso 9]>
                    </v:textbox>
                    </v:rect>
                    <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
    </td>
</tr>
