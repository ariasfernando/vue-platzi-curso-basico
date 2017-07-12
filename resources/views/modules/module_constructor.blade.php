{{-- Menu constructor --}}
<?php
    $excluded_modules = [
        $params['campaign_data']->getLibraryConfig('fixed_footer'),
        $params['campaign_data']->getLibraryConfig('fixed_header')
    ]
?>
@if ( isset($params['campaign_data']) )
	@foreach ( $params['campaign_data']['modules_data'] as $module )
		<?php
			$module_path = $app_config["modules"][ $module['module_id'] ]["file_parent"] . "." . $params['campaign_data']['library'] . '.modules.' . $module['module_id'];
			if ( isset($module['type']) ) {
				$module_path .= ".template";
			}
		?>
		@if ( isset($app_config["modules"][ $module['module_id'] ]["file_parent"]) )
			{{ StensulLocale::init($params['campaign_data']['locale'], ["name" => $module['module_id'],"app_name" => $app_config["modules"][ $module['module_id'] ]["file_parent"]]) }}
		@endif
	@endforeach
@endif
