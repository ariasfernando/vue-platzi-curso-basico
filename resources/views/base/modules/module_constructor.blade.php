{{-- Menu constructor --}}
@if ( isset($params['campaign_data']) )
	@foreach ( $params['campaign_data']['modules_data'] as $module )
		<?php
			$module_path = $app_config["modules"][ $module['type'] ]["file_parent"] . "." . $params['campaign_data']['library'] . '.modules.' . $module['type'];
			if ( isset($module['class']) ) {
				$module_path .= ".module";
			}
		?>
		@if ( isset($app_config["modules"][ $module['type'] ]["file_parent"]) )
			{{ StensulLocale::init($params['campaign_data']['locale'], ["name" => $module['type'],"app_name" => $app_config["modules"][ $module['type'] ]["file_parent"]]) }}
			@include(Helper::validateView($module_path))
		@endif
	@endforeach
@endif
