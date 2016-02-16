<?php
	$module_params = $app_config["modules"]["free_range_text_paragraph"];

	// Module Params
	if( !isset($module_params['data']) ){
		$module_params['data'] = (isset($module['data']))? $module['data']:'';
	}
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
	<td>
		<table bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
			<tr>
				<td align="left" valign="top" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; color:{{ isset($module_params['data']['color'])? $module_params['data']['color'] : '#555555'}}; font-size:13px; line-height:17px; padding-right:35px;">
					<div class="text-overlay">
						<div class="prevent-overflow">
							<p id="text-editable" class="st-edit-text">
								@if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
									{!! $module_params['data']['text0'] !!}
								@else
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempus, lacus et vehicula congue, felis diam rhoncus enim, a scelerisque sapien nulla non tortor. Mauris aliquet accumsan lorem, eget blandit diam pretium at.
								@endif
							</p>
						</div>
						<div class="text-overlay-toolbox"></div>
					</div>
				</td>
			</tr>
		</table>
	</td>
</tr>