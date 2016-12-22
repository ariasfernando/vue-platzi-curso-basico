<?php

	// Plugins
	$module_params['plugins'] = [
		'colorPicker' => [
			'defaultValue' => (isset($module['data']['text-color']))? $module['data']['text-color'] : "#FF5555"
		]
	];
?>
<tr data-params='{{json_encode($module_params)}}'>
	<td class="st-add-icon-config">
		<table height="16px" bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
			<tr>
				<td valign="middle" align="center" height="16px" style="line-height:18px;">
					<p class="st-inline-block st-save-only-text"
					   contenteditable="true"
					   data-line-limit="2"
					   style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:16px;line-height:18px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-weight:bold;text-align:center;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;color:<?php echo $module_params["plugins"]["colorPicker"]["defaultValue"]; ?>;">
					     {!! $module_params['data']['text0'] or "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT." !!}
					</p>
				</td>
			</tr>
		</table>
	</td>
</tr>
