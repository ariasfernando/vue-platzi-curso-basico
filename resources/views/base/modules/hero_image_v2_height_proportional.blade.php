<?php
    // Get module params from config file.
    $module_params = $app_config["modules"]["hero_image_v2_height_proportional"];

    // Get module Params
    if( !isset($module_params['data']) ){
        $module_params['data'] = (isset($module['data']))? $module['data']:'';
    }

    // Get image data
    if( isset($module_params['data']['image0']) ){// Saved image
        $image0 = $module_params['data']['image0'];
        $image_source = "/images/campaigns". $image0['path'];
    }elseif( isset($module_params['placeholder_image']) ){
        // Or placeholder
        $image_source = $module_params['placeholder_image'];
    }

    $image_width = $params['campaign_data']->getLibraryConfig('template_width');
    if( !empty($image0['background_width']) ){
        $image_width = $image0['background_width'];
    }
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
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
                    <a href="{{ isset($image['destination_url'])? $image['destination_url'] : '#' }}"
                        data-key="image0"
                        data-open-element-config="mie_v2_default_height_proportional">
                        {!! Html::image( url() . $image_source ,
                            ( isset($image['alt']) )? $image['alt']:'',
                            array(
                                'title' => ( isset($image['alt']) )? $image['alt']:'',
                                'width' => $image_width,
                                'border' => '0',
                                'style' => 'display:block;border:none;max-width:100%;height:auto;'
                            ))
                        !!}
                    </a>
                </td>
            </tr>
        </table>
    </td>
</tr>