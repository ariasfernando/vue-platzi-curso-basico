<?php

	/*
	* -- Column 1 --
	*/
	$image0 = null;
	if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
		$image0 = $module_params['data']['image0'];
	}

	$text0 = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';
	if( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) ){
		$text0 = $module_params['data']['text0'];
	}

	$buttonData0 = [
		'text' => 'CTA Button',
		'destination_url' => '#'
	];
	if( isset($module_params['data']['text1']) && !empty($module_params['data']['text1']) ){
		$buttonData0['text'] = $module_params['data']['text1'];
	}
	if( isset($module_params['data']['link0']) && !empty($module_params['data']['link0']) ){
		$buttonData0['destination_url'] = $module_params['data']['link0'];
	}

	/*
	* -- Column 2 --
	*/
	$image1 = null;
	if( isset($module_params['data']['image1']) && !empty($module_params['data']['image1']) ){
		$image1 = $module_params['data']['image1'];
	}

	$text1 = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';
	if( isset($module_params['data']['text2']) && !empty($module_params['data']['text2']) ){
		$text1 = $module_params['data']['text2'];
	}

	$buttonData1 = [
		'text' => 'CTA Button',
		'destination_url' => '#'
	];
	if( isset($module_params['data']['text3']) && !empty($module_params['data']['text3']) ){
		$buttonData1['text'] = $module_params['data']['text3'];
	}
	if( isset($module_params['data']['link1']) && !empty($module_params['data']['link1']) ){
		$buttonData1['destination_url'] = $module_params['data']['link1'];
	}

?>
{{-- Two Column Media With Text: Start --}}
<tr data-params='{{json_encode($module_params)}}'>
	<td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%">

		<!--[if (gte mso 9)|(IE)]>
		<table border="0" cellspacing="0" cellpadding="0" align="center" width="660">
			<tr>
				<td align="center" valign="top" width="660">
		<![endif]-->

		<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:660px;">
			<tbody><tr>
				<td align="center" valign="top" style="font-size:0; padding: 10px 0;">

					<!--[if (gte mso 9)|(IE)]>
					<table border="0" cellspacing="0" cellpadding="0" align="center" width="660">
						<tr>
							<td align="left" valign="top" width="330">
					<![endif]-->

					<div style="display:inline-block; margin: 0 -2px; width:100%; min-width:200px; max-width:330px; vertical-align:top;" class="stack-column">
						<table cellspacing="0" cellpadding="0" border="0" width="100%">
							<tbody><tr>
								<td style="padding: 10px 10px;">
									@include('base.modules.two_column_media_with_text.column', [
										'image' => $image0,
										'image_key' => 'image0',
										'text' => $text0,
										'buttonData' => $buttonData0
									])
								</td>
							</tr></tbody>
						</table>
					</div>

					<!--[if (gte mso 9)|(IE)]>
                            </td>
                            <td align="left" valign="top" width="330">
					<![endif]-->

					<div style="display:inline-block; margin: 0 -2px; width:100%; min-width:200px; max-width:330px; vertical-align:top;" class="stack-column">
						<table cellspacing="0" cellpadding="0" border="0" width="100%">
							<tbody><tr>
								<td style="padding: 10px 10px;">
									@include('base.modules.two_column_media_with_text.column', [
										'image' => $image1,
										'image_key' => 'image1',
										'text' => $text1,
										'buttonData' => $buttonData1
									])
								</td>
							</tr></tbody>
						</table>
					</div>

					<!--[if (gte mso 9)|(IE)]>
							</td>
						</tr>
					</table>
					<![endif]-->
				</td>
			</tr></tbody>
		</table>

		<!--[if (gte mso 9)|(IE)]>
				</td>
			</tr>
		</table>
		<![endif]-->

	</td>
</tr>
{{-- Two Column Media With Text: End --}}
