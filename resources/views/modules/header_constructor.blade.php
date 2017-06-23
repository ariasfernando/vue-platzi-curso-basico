@if ( isset($params['campaign_data']) )
<?php
	$fixed_header = $params['campaign_data']->getLibraryConfig('fixed_header');

	if ( $fixed_header ) {
	    foreach($params['campaign_data']['modules_data'] as  $key => $moduleData){
            if($moduleData['type'] === $fixed_header){
                $module = $params['campaign_data']['modules_data'][$key];
            }
        }
	}
?>

	@if ($fixed_header)
		@include( Helper::validateView($app_config["modules"][ $fixed_header ]["file_parent"] . "." . $params['campaign_data']['library'] . '.modules.' . $fixed_header) )
	@endif
@endif