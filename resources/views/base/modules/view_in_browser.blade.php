<?php
	$module_params = $app_config["modules"]["view_in_browser"];

	// Module Params
	if( !isset($module_params['data']) ){
		$module_params['data'] = (isset($module['data']))? $module['data']:'';
	}
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
	<td align="center" style="vertical-align:middle;">
		<table width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td height="15" align="center" >
					<table style="border-collapse:collapse;border-spacing:0px;padding:0px!important;margin:0px!important;" 
					       cellpadding="0" 
					       cellspacing="0" 
					       border="0" 
					       width="100%" 
					       class="standard-header-table" 
					   >	
						<tr>
							<td width="50%" align="left" contenteditable class="st-save-only-text">
								@if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
									{!! $module_params['data']['text0'] !!}
								@else
									<p style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:11px;color:#999999;line-height:normal;margin:0px;padding:0px;">
										Lorem ipsum dolor sit amet
									</p>
								@endif
							</td>	
							<td width="50%" align="right">	
								<!-- VIEW IN BROWSER -->
								<a style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:11px;color:#468aca;line-height:normal;margin:0px;padding:0px;text-decoration:none;" 
								   href="[VIEW_IN_BROWSER_LINK]"
								   class="st-without-event st-no-tracking">View our web version</a>
								<!-- VIEW IN BROWSER ENDS -->
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</td>
</tr>