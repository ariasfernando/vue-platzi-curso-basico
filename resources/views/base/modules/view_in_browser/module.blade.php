<?php
	$module_params = $app_config["modules"]["view_in_browser"];

	// Module Params
	if( !isset($module_params['data']) ){
		$module_params['data'] = (isset($module['data']))? $module['data']:'';
	}
?>

@include('base.modules.view_in_browser.template')