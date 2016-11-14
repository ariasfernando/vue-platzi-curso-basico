<?php

    // Get image data
    if( isset($module_params['data']['image0']) ){// Saved image
        $image0 = $module_params['data']['image0'];
        $image_source = "/images/campaigns". $image0['path'];
    }elseif( isset($module_params['placeholder_image']) ){
        // Or placeholder
        $image_source = $module_params['placeholder_image'];
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
                <td style="vertical-align:top;"
                    width="100%"
                    valign="top"
                    align="center"
                    bgcolor="#ffffff"
                >
                    <a href='{{ isset($image['destination_url']) ? $image['destination_url'] : '#' }}'
                        data-key="image0"
                        data-open-element-config="mie_v2_library">
                        {!! Html::image( url('/') . $image_source ,
                            ( isset($image['alt']) )? $image['alt']:'',
                            array(
                                'title' => ( isset($image['alt']) )? $image['alt']:'',
                                'width' => $params['campaign_data']->getLibraryConfig('template_width'),
                                'border' => '0',
                                'class' => 'full-width',
                                'style' => 'display:block;border:none;max-width:100%;height:auto;'
                            ))
                        !!}
                    </a>
                </td>
            </tr>
        </table>
    </td>
</tr>