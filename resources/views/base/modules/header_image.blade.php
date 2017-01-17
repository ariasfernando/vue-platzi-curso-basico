<?php
	$module_params = $app_config["modules"]["header_image"];

	// Module Params
	if( !isset($module_params['data']) ){
		$module_params['data'] = (isset($module['data']))? $module['data']:'';
	}


	if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
		$image = $module_params['data']['image0'];
	}
?>

<tr data-params='<?php echo htmlentities( json_encode($module_params), ENT_QUOTES, 'UTF-8' ); ?>'>
	<td align="center" style="vertical-align:middle;">
		<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
			<tr>
				<td style="vertical-align:top;"
					width="100%" 
				    valign="top" 
				    align="center" 
				    bgcolor="#ffffff"
				>
					<a href="<?php echo ( isset($image['destination_url']) )? $image['destination_url']:'#'; ?>" data-master-image-editor="header">
						@if ( isset($image['path']) && !empty($image['path']) )
								{!! Html::image( url('/') . "/images/campaigns". $image['path'],
									(isset($image['alt']))? $image['alt']: '',
									array(
										'title' => (isset($image['alt']))? $image['alt']: '',
										'alt' => (isset($image['alt']))? $image['alt']: '',
										'width' => $params['campaign_data']->getLibraryConfig('template_width'),
										'border' => '0',
										'data-image' => '',
                                        'class' => 'full-width',
										'style' => 'display:block;max-width:100%;height:auto;'
									))
								!!}
						@else
							{!! Html::image( url('/') . $module_params['placeholder_image'],
								'header_image',
								array(
									'title' => 'header_image',
									'width' => $params['campaign_data']->getLibraryConfig('template_width'),
									'border' => '0',
									'data-image' => '',
                                    'class' => 'full-width',
									'style' => 'display:block;max-width:100%;height:auto;'
								))
							!!}
						@endif
					</a>
				</td>
			</tr>
		</table>
		<span class="hr" style="display:none!important;width:0px!important;height:0px!important;line-height:0px!important;margin:0!important;border:0!important;padding:0!important;"></span>
	</td>
</tr>