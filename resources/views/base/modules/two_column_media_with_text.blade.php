<?php
	$module_params = $app_config["modules"]["two_column_media_with_text"];

	// Module Params
	if( !isset($module_params['data']) ){
		$module_params['data'] = (isset($module['data']))? $module['data']:'';
	}

	if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
		$image0 = $module_params['data']['image0'];
	}

	if( isset($module_params['data']['image1']) && !empty($module_params['data']['image1']) ){
		$image1 = $module_params['data']['image1'];
	}
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
	<td valign="top">
		<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%!important;">
			<tr>
				 <td valign="top">
				<!--[if gte mso 9]>
					</td>
					<td valign="top">
				<![endif]-->
					<table class="st-box wrapper-table"
						   align="left"
						   cellpadding="0"
						   cellspacing="0"
						   border="0"
						   width="320"
					>
						<tr>
							<td>
								<table align="center"
									   border="0"
									   cellpadding="0"
									   cellspacing="0"
									   width="320"
									   class="st-data-modal-parent"
								>
									<tr>
										<td>
											<a href="{{ isset($image0['destination_url']) ? $image0['destination_url'] : '#' }}" data-master-image-editor="standard">
												@if ( isset($image0['path']) && !empty($image0['path']) )
														{!! Html::image( url() . "/images/campaigns". $image0['path'],
															( isset($image0['alt']) )? $image0['alt']:'',
																array(
																	'title' => ( isset($image0['alt']) )? $image0['alt']:'',
																	'width' => 320,
																	'height' => 240,
																	'border' => '0',
																	'style' => 'display:block;border:none;'
																)
															)
														!!}
												@else
													{!! Html::image( url() . $module_params['placeholder_image'],
																 'side-by-side-content-blocks',
																	array(
																		'title' => 'side-by-side-content-blocks',
																		'width' => 320,
																		'height' => 240,
																		'border' => '0',
																		'style' => 'display:block;border:none;'
																	)
																) 
													!!}
												@endif
											</a>
										</td>
									</tr>

									<tr>
										<td height="12px" style="line-height:12px;">&nbsp;</td>
									</tr>

									<tr>
										<td height="14">
											@if ( isset($module_params['data']['text0']) && !empty($module_params['data']['text0']) )
												{!! $module_params['data']['text0'] !!}
											@else
												<p style="max-width:320px;width:320px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};text-align:left;font-size:14px;line-height:14px;color:#6402ce;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;"
												   class="st-inline-block"
												   contenteditable="true"
												>LOREM IMPSUM</p>
											@endif
										</td>
									</tr>

									<tr>
										<td height="5" style="line-height:5px;">&nbsp;</td>
									</tr>

									<tr>
										<td height="48">
											@if ( isset($module_params['data']['text1']) && !empty($module_params['data']['text1']) )
												{!! $module_params['data']['text1'] !!}
											@else
													<a  style="max-width:320px;width:320px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:20px;text-align:left;line-height:24px;color:#424242;text-decoration:none;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;display:block;"
														data-contenteditable-href="{{ isset($image0['destination_url']) ? $image0['destination_url'] : ' ' }}"
														contenteditable="true"
													>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a>
											@endif
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				<!--[if gte mso 9]>
					</td>
					<td valign="top">
				<![endif]-->
					<table align="left"
						   border="0"
						   cellpadding="0"
						   cellspacing="0"
						   width="20"
						   height="20"
						   class="wrapper-table"
					>
						<tr>
							<td width="20" height="20" class="element-block-center">&nbsp;</td>
						 </tr>
					</table>
				<!--[if gte mso 9]>
					</td>
					<td valign="top">
				<![endif]-->
					<table class="st-box wrapper-table"
						   align="left"
						   cellpadding="0"
						   cellspacing="0"
						   border="0"
						   width="320"
					>
						<tr>
							<td>
								<table align="center"
									   border="0"
									   cellpadding="0"
									   cellspacing="0"
									   width="320"
									   class="st-data-modal-parent"
								>
									<tr>
										<td valign="top">
											<a href='{{ isset($image1['destination_url']) ? $image1['destination_url'] : '#' }}' data-master-image-editor="standard">
												@if ( isset($image1['path']) && !empty($image1['path']) )
													{!! Html::image(  url() . "/images/campaigns". $image1['path'],
														( isset($image1['alt']) )? $image1['alt']:'',
															array(
																'title' => ( isset($image1['alt']) )? $image1['alt']:'',
																'width' => 320,
																'height' => 240,
																'border' => '0',
																'style' => 'display:block;border:none;'
															)
														)
													!!}
												@else
													{!! Html::image( url() . $module_params['placeholder_image'],
														'content-block-more-ad-uni',
															array(
																'title' => 'content-block-more-ad-uni',
																'width' => 320,
																'height' => 240,
																'border' => '0',
																'style' => 'display:block;border:none;'
															)
														)
													!!}
												@endif
											</a>
										</td>
									</tr>

									<tr>
										<td height="12px" style="line-height:12px;">&nbsp;</td>
									</tr>

									<tr>
										<td height="14">
											@if ( isset($module_params['data']['text2']) && !empty($module_params['data']['text2']) )
												{!! $module_params['data']['text2'] !!}
											@else
												<p style="max-width:320px;width:320px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:14px;text-align:left;line-height:14px;color:#6402ce;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;"
												   class="st-inline-block"
												   contenteditable="true"
												>LOREM IMPSUM</p>
											@endif
										</td>
									</tr>

									<tr>
										<td height="5" style="line-height:5px;">&nbsp;</td>
									</tr>

									<tr>
										<td height="48">
											@if ( isset($module_params['data']['text3']) && !empty($module_params['data']['text3']) )
												{!! $module_params['data']['text3'] !!}
											@else
												<a  style="max-width:320px;width:320px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:20px;line-height:24px;color:#424242;text-decoration:none;margin-top:0;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0;display:block;"
													data-contenteditable-href="{{ isset($image1['destination_url']) ? $image1['destination_url'] : ' ' }}"
													contenteditable="true"
													>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a>
											@endif
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</td>
</tr>