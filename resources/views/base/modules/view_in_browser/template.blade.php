
{{-- View in Browser: Start --}}
<tr data-params='{{json_encode($module_params)}}'>
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
								@if ( !empty($module_params['data']['text0']) )
									{!! $module_params['data']['text0'] !!}
								@else
									<p style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:11px;color:#999999;line-height:normal;margin:0px;padding:0px;">
										Lorem ipsum dolor sit amet
									</p>
								@endif
							</td>	
							<td width="50%" align="right">
								<a style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:11px;color:#468aca;line-height:normal;margin:0px;padding:0px;text-decoration:none;" 
								   href="[VIEW_IN_BROWSER_LINK]"
								   class="st-without-event st-no-tracking">View our web version</a>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</td>
</tr>
{{-- View in Browser: End --}}
