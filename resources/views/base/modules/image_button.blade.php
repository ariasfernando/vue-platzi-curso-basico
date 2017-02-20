<?php

	// Set image
	$imageData = [
		'source' => isset($module_params['placeholder_image']) ? url('/') . image($module_params['placeholder_image']) : '',
		'alt' => 'button-place-holder'
	];

	if( isset($module_params['data']['button0']['path']) && !empty($module_params['data']['button0']['path']) ){
		$imageData['source'] = url('/') . "/images/campaigns". $module_params['data']['button0']['path'];
	}

	if( isset($module_params['data']['button0']['label']) && !empty($module_params['data']['button0']['label']) ){
		$imageData['alt'] = $module_params['data']['button0']['label'];
	}

	$imageData['attr'] = [
		'title' => $imageData['alt'],
		'border' => '0',
		'height' => '40',
		'data-image' => '',
		'style' => 'display:block;max-width:100%;max-height:100%;border:none;'
	];
?>
<tr data-params='{{json_encode($module_params)}}'>
	<td align="left" valign="top" style="vertical-align:top;">
		<table width="100%" height="35" cellpadding="0" cellspacing="0" border="0" style="width:100%!important;">
			<tbody>
				<tr>
					<td width="28" align="left" valign="top" class="hidden-device"></td>
					<td align="left" valign="top" class="mobile-margin" style="vertical-align:top;">
						<table cellpadding="0" cellspacing="0" border="0" align="left">
							<tbody>
								<tr>
									<td align="left" valign="top" height="35">
										<table height="35" cellpadding="0" cellspacing="0" border="0">
											<tbody>
												<tr>
													<td
														align="center"
														valign="middle"
														height="35"
														style="vertical-align: middle;mso-line-height-rule:exactly;line-height:15px;">
														<a
															href="{{ isset($module_params['data']['button0']['link'])? $module_params['data']['button0']['link']:'#' }}"
															target="_blank"
															class="st-without-event st-cta-button st-validate-href"
															data-master-button-editor="default_button"
															style="mso-line-height-rule:exactly;line-height:30px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:14px;color:#ffffff;font-weight:normal;text-decoration:none;margin:0px!important;padding:0!important;display:block;">
															{!! Html::image( $imageData['source'], $imageData['alt'], $imageData['attr'] ) !!}
														</a>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
	</td>
</tr>
