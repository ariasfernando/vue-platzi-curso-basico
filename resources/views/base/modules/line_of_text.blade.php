<?php
	$module_params = $app_config["modules"]["line_of_text"];

	// Module Params
	if( !isset($module_params['data']) ){
		$module_params['data'] = (isset($module['data']))? $module['data']:'';
	}

	// Plugins
	$module_params['plugins'] = [
		'colorPicker' => [
			'defaultValue' => (isset($module['data']['text-color']))? $module['data']['text-color'] : "#FF5555"
		]
	];
?>
<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
	<td class="st-add-icon-config">
		<table height="16px" bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
			<tr>
				<td valign="middle" align="center" height="16px" style="line-height:16px;"> 
					@if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
						{!! $module_params['data']['text0'] !!}
					@else
						<p
							class="st-inline-block"
							contenteditable="true"
							style="font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:16px;line-height:18px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;font-weight:bold;text-align:center;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;color:<?php echo $module_params["plugins"]["colorPicker"]["defaultValue"]; ?>;"
						>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.</p>
					@endif
				</td>
			</tr>
		</table>
	</td>
</tr>