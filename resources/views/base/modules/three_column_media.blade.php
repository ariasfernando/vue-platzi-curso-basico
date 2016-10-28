<?php
	$module_params = $app_config["modules"]["three_column_media"];

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

	if( isset($module_params['data']['image2']) && !empty($module_params['data']['image2']) ){
		$image2 = $module_params['data']['image2'];
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
					<table class="st-box full-width"
						   align="left"
						   cellpadding="0"
						   cellspacing="0"
						   border="0"
						   width="210"
					>
						<tr>
							<td>
								<table align="center"
									   border="0"
									   cellpadding="0"
									   cellspacing="0"
									   width="210"
									   class="st-data-modal-parent"
								>
									<tr>
										<td>
											<a href="{{ isset($image0['destination_url']) ? $image0['destination_url'] : '#' }}" data-master-image-editor="standard">
												@if ( isset($image0['path']) && !empty($image0['path']) )
														{!! Html::image( url()->full() . "/images/campaigns". $image0['path'],
															( isset($image0['alt']) )? $image0['alt']:'',
																array(
																	'title' => ( isset($image0['alt']) )? $image0['alt']:'',
																	'width' => 210,
																	'height' => 240,
																	'border' => '0',
																	'style' => 'display:block;border:none;'
																)
															)
														!!}
												@else
													{!! Html::image( url()->full() . $module_params['placeholder_image'],
																 'side-by-side-content-blocks',
																	array(
																		'title' => 'side-by-side-content-blocks',
																		'width' => 210,
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
						   width="15"
						   height="20"
						   class="full-width"
					>
						<tr>
							<td width="15" height="20" class="element-block-center">&nbsp;</td>
						 </tr>
					</table>
				<!--[if gte mso 9]>
					</td>
					<td valign="top">
				<![endif]-->
					<table class="st-box full-width"
						   align="left"
						   cellpadding="0"
						   cellspacing="0"
						   border="0"
						   width="210"
					>
						<tr>
							<td>
								<table align="center"
									   border="0"
									   cellpadding="0"
									   cellspacing="0"
									   width="210"
									   class="st-data-modal-parent"
								>
									<tr>
										<td valign="top">
											<a href='{{ isset($image1['destination_url']) ? $image1['destination_url'] : '#' }}' data-master-image-editor="standard">
												@if ( isset($image1['path']) && !empty($image1['path']) )
													{!! Html::image(  url()->full() . "/images/campaigns". $image1['path'],
														( isset($image1['alt']) )? $image1['alt']:'',
															array(
																'title' => ( isset($image1['alt']) )? $image1['alt']:'',
																'width' => 210,
																'height' => 240,
																'border' => '0',
																'style' => 'display:block;border:none;'
															)
														)
													!!}
												@else
													{!! Html::image( url()->full() . $module_params['placeholder_image'],
														'side-by-side-content-blocks',
															array(
																'title' => 'side-by-side-content-blocks',
																'width' => 210,
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
						   width="15"
						   height="20"
						   class="full-width"
					>
						<tr>
							<td width="15" height="20" class="element-block-center">&nbsp;</td>
						 </tr>
					</table>
				<!--[if gte mso 9]>
					</td>
					<td valign="top">
				<![endif]-->
					<table class="st-box full-width"
						   align="left"
						   cellpadding="0"
						   cellspacing="0"
						   border="0"
						   width="210"
					>
						<tr>
							<td>
								<table align="center"
									   border="0"
									   cellpadding="0"
									   cellspacing="0"
									   width="210"
									   class="st-data-modal-parent"
								>
									<tr>
										<td valign="top">
											<a href='{{ isset($image2['destination_url']) ? $image2['destination_url'] : '#' }}' data-master-image-editor="standard">
												@if ( isset($image2['path']) && !empty($image2['path']) )
													{!! Html::image(  url()->full() . "/images/campaigns". $image2['path'],
														( isset($image2['alt']) )? $image2['alt']:'',
															array(
																'title' => ( isset($image2['alt']) )? $image2['alt']:'',
																'width' => 210,
																'height' => 240,
																'border' => '0',
																'style' => 'display:block;border:none;'
															)
														)
													!!}
												@else
													{!! Html::image( url()->full() . $module_params['placeholder_image'],
														'side-by-side-content-blocks',
															array(
																'title' => 'side-by-side-content-blocks',
																'width' => 210,
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

								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</td>
</tr>
