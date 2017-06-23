
{{-- Free Text : Start --}}
<tr data-params='{{json_encode($module_params)}}'>
	<td bgcolor="#ffffff">
		<table cellspacing="0" cellpadding="0" border="0" width="100%">
			<tbody><tr>
				<td style="padding: 40px; font-family: {{ $params['campaign_data']->getLibraryConfig('font_family') }}; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: {{ $module_params['data']['color'] or "#555555" }};">
                    <div class="text-overlay">
						<div class="prevent-overflow">
							<p id="text-editable" class="st-edit-text">
					            {!! $module_params['data']['text0'] or "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempus, lacus et vehicula congue, felis diam rhoncus enim, a scelerisque sapien nulla non tortor. Mauris aliquet accumsan lorem, eget blandit diam pretium at." !!}
							</p>
						</div>
						<div class="text-overlay-toolbox"></div>
					</div>
				</td>
			</tr></tbody>
		</table>
	</td>
</tr>
{{-- Free Text : End --}}
