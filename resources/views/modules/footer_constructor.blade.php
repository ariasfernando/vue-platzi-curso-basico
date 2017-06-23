
@if ( isset($params['campaign_data']) )
<?php 

	$footer_fixed = $params['campaign_data']->getLibraryConfig('fixed_footer');

?>
	@if ($footer_fixed)
<?php
	foreach($params['campaign_data']['modules_data'] as  $key => $moduleData){
		if($moduleData['type'] === $footer_fixed){
			$module = $params['campaign_data']['modules_data'][$key];
		}
	}
?>
		@include( Helper::validateView($app_config["modules"][ $footer_fixed ]["file_parent"] . "." . $params['campaign_data']['library'] . '.modules.' . $footer_fixed) )
	@endif
@endif