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

<tr data-params='{{json_encode($module_params)}}'>
    <td align="center" style="vertical-align:middle;">
        <table style="width:100%!important;"
               width="100%"
               cellpadding="0"
               cellspacing="0"
               border="0"
        >
            <tr>
                <td
                    style="vertical-align:top;"
                    width="320"
                    valign="top"
                    align="center"
                    bgcolor="#ffffff"
                    >
                        <div class="display-mobile" style="display:none;width:0;overflow:hidden;max-height:0;">
                            <p
                                class="st-title-mobile"
                                style="font-size:30px;line-height:32px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};color:#000000;margin:0;text-align:left;padding:20px;word-break:break-word;">
                                {{ $image_source_title }}
                            </p>
                        </div>
                </td>
            </tr>
            <tr>
                <td style="vertical-align:top;"
                    width="100%"
                    valign="top"
                    align="center"
                    bgcolor="#ffffff"
                >
                    <a href='{{ isset($image['destination_url'])? $image['destination_url'] : '#' }}'
                       data-master-image-editor="heroMobile">
                        {!! Html::image( url('/') . $image_source_desktop ,
                            ( isset($image['alt']) )? $image['alt']:'',
                            array(
                                'title' => ( isset($image['alt']) )? $image['alt']:'',
                                'width' => $params['campaign_data']->getLibraryConfig('template_width'),
                                'border' => '0',
                                'class' => 'hidden-device full-width',
                                'style' => 'display:block;border:none;max-width:100%;height:auto;'
                            ))
                        !!}
                        <div class="show-img-device" style="display:none;width:0;overflow:hidden;max-height:0!important;">
                        {!! Html::image( url('/') . $image_source_mobile ,
                            ( isset($image['alt']) )? $image['alt']:'',
                            array(
                                'title' => ( isset($image['alt']) )? $image['alt']:'',
                                'width' => $params['campaign_data']->getLibraryConfig('template_width'),
                                'border' => '0',
                                'class' => 'full-width',
                                'style' => 'display:block;border:none;max-width:100%;height:auto;'
                            ))
                        !!}
                        </div>
                    </a>
                </td>
            </tr>
        </table>
    </td>
</tr>
