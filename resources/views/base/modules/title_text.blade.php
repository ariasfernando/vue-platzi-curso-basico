<?php
	$module_params = $app_config["modules"]["title_text"];

	// Module Params
	if( !isset($module_params['data']) ){
		$module_params['data'] = (isset($module['data']))? $module['data']:'';
	}
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
	<td>
		<table bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
			<tr>
				<td align="left" valign="top" style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size:26px; line-height:38px; color:{{ isset($module_params['data']['color'])? $module_params['data']['color'] : '#ec2127'}}; font-weight:normal;">
					<div class="text-overlay">
						<div class="prevent-overflow">
							<p id="text-editable" class="st-edit-text" style="margin: 0;">
								@if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
									{!! $module_params['data']['text0'] !!}
								@else
									Lorem ipsum dolor sit amet
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