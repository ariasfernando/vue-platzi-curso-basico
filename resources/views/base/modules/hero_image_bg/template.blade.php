<?php
    if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
        $image = $module_params['data']['image0'];
    }

    if ( isset($image['background_image']) && !empty($image['background_image']) ){
        $bg_image_src = url('/images/campaigns'. $image['background_image']);
    }else{
        $bg_image_src = url($module_params['placeholder_image']);
    }
?>

{{-- Hero Image BG: Start --}}

<tr data-params='{{json_encode($module_params)}}'>
    {{-- Bulletproof Background Images c/o https://backgrounds.cm --}}
    <td width="100%" height="400" class="st-add-icon-config st-background-target" align="center" background="{{ $bg_image_src }}" bgcolor="#FFFFFF" valign="middle" style="width: 100%; height: 400px; max-width: 680px; text-align: center; background-position: center center !important; background-size: cover !important;">
        <!--[if (mso)|(IE)]>
        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:680px;height:400px; background-position: center center !important;">
        <v:fill type="frame" src="{{ $bg_image_src }}" color="#FFFFFF" />
        <v:textbox inset="0,0,0,0">
        <![endif]-->
        <div>
            <!--[if (mso)|(IE)]>
            <table border="0" cellspacing="0" cellpadding="0" align="center" width="680" height="400" style="height: 400px; width: 100%; max-width: 680px">
            <tr>
            <td align="center" valign="middle" width="680" style="height: 400px; width: 100%; max-width: 680px">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="400" style="height: 400px; max-width:500px; margin: auto;">
                <tbody><tr>
                    <td valign="middle" style="text-align: center; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #ffffff;">
                        @if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
                            {!! $module_params['data']['text0'] !!}
                        @else
                            <h1 contenteditable="true" style="font-size:30px;line-height:30px;color:#ffffff;font-weight:bold;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-shadow:1px 1px #444444;">
                                LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.
                            </h1>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="middle">
                        <a href="{{ $module_params['data']['button0']['link'] or '#' }}" class="button-a st-without-event st-cta-button" style="background: #222; border: 15px solid #222; font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};letter-spacing:.35px; text-decoration:none;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; border-radius: 3px; font-weight: bold;">
                            <span contenteditable="true" truncate="50" class="st-save-only-text st-content-editable-single-line st-button0" style="color: #FFFFFF">
                                {{ $module_params['data']['text1'] or "Primary Button" }}
                            </span>
                        </a>
                    </td>
                </tr>
            </tbody></table>
            <!--[if (mso)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </div>
        <!--[if (mso)|(IE)]>
        </v:textbox>
        </v:rect>
        <![endif]-->
    </td>
</tr>
{{-- Hero Image BG: End --}}
