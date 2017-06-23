<?php
    // Module Params
    $module_params = $app_config["modules"]["spacer"];

    if( !isset($module_params['data']) ){
        $module_params['data'] = (isset($module['data']))? $module['data']:'';
    }

    $background_color = ( isset($module_params['background_colors']['default']) ) ? $module_params['background_colors']['default'] : '#fff';
    $background_color = ( isset($module_params['data']['background_color']) ) ? $module_params['data']['background_color'] : $background_color;
    $module_params['data']['background_color'] = ( isset($module_params['data']['background_color']) ) ? $module_params['data']['background_color'] : $background_color;

    $size = ( isset($module_params['sizes']['default']) ) ? $module_params['sizes']['default'] : '18';
    $size = ( isset($module_params['data']['size']) ) ? $module_params['data']['size'] : $size;
    $module_params['data']['size'] = ( isset($module_params['data']['size']) ) ? $module_params['data']['size'] : $size;

?>

@include('modules.spacer.template')