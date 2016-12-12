<?php
    // Get image data from mongo
    if( isset($module_params['data']['image0']) ){// Saved image
        $image0 = $module_params['data']['image0'];

        $image_source_desktop = "/images/campaigns". $image0['path'];
        $image_source_mobile  = "/images/campaigns". $image0['mobile']['path'];
        $image_source_title  = $image0['title_mobile'];

    }elseif( isset($module_params['placeholder_image']) ){
        // Or placeholder
        $image_source_desktop = $module_params['placeholder_image'];
        $image_source_mobile  = $module_params['placeholder_image'];
        $image_source_title  = '';
    }

?>
{{-- Hero Image Mobile Version: Start --}}
<tr data-params='{{json_encode($module_params)}}'>
    <td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%">
        <table style="width:100%!important;" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td style="vertical-align:top;" width="320" valign="top" align="center" bgcolor="#ffffff" >
                    <div class="show-mobile" style="display: none">
                        <p
                            class="st-title-mobile"
                            style="font-size:30px;line-height:32px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};color:#000000;margin:0;text-align:left;padding:20px;word-break:break-word;">
                            {{ $image_source_title }}
                        </p>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:top;" width="100%" valign="top" align="center" bgcolor="#ffffff">
                    <a href="{{ $image['destination_url'] or '#' }}" data-master-image-editor="heroMobile">

                        {!! Html::image( url($image_source_desktop), isset($image['alt']) ? $image['alt'] : '', array(
                            'title' => isset($image['alt']) ? $image['alt'] : '',
                            'width' => $params['campaign_data']->getLibraryConfig('template_width'),
                            'border' => '0',
                            'class' => 'hidden-mobile',
                            'style' => 'border: 0; width: 100%; max-width: 680px; height: auto;'
                        )) !!}

                        <div class="show-mobile" style="display:none;">

                            {!! Html::image( url($image_source_mobile), isset($image['alt']) ? $image['alt'] : '', array(
                                'title' => isset($image['alt']) ? $image['alt'] : '',
                                'width' => $params['campaign_data']->getLibraryConfig('template_width'),
                                'border' => '0',
                                'class' => 'center-on-narrow',
                                'style' => 'border: 0; width: 100%; max-width: 680px; height: auto;'
                            )) !!}

                        </div>
                    </a>
                </td>
            </tr>
        </table>
    </td>
</tr>
{{-- Hero Image Mobile Version: End --}}
