{{-- Menu constructor --}}
@if ( isset($params['campaign_data']) )
	@foreach ( $params['campaign_data']['modules_data'] as $module )
		@if ( isset($app_config["modules"][ $module['type'] ]["file_parent"]) )
			@include( Helper::validateView($app_config["modules"][ $module['type'] ]["file_parent"] . "." . $params['campaign_data']['library'] . '.modules.' . $module['type']) )
		@endif
	@endforeach
@endif