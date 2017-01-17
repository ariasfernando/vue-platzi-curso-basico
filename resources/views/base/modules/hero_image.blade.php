<?php
	$module_params = $app_config["modules"]["hero_image"];

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
		<table style="width:100%!important;" 
			   width="100%"
			   cellpadding="0" 
			   cellspacing="0" 
			   border="0" 
		>
			<tr>
				<td style="vertical-align:top;"
					width="100%" 
				    valign="top" 
				    align="center" 
				    bgcolor="#ffffff"
				>
					<a href='{{ isset($image['destination_url'])? $image['destination_url'] : '#' }}' data-master-image-editor="hero">
						@if ( isset($image['path']) && !empty($image['path']) )
							{!! Html::image( url('/') . "/images/campaigns". $image['path'],
								( isset($image['alt']) )? $image['alt']:'',
								array(
									'title' => ( isset($image['alt']) )? $image['alt']:'',
									'width' => $params['campaign_data']->getLibraryConfig('template_width'),
									'border' => '0',
									'data-image' => '',
                                    'class' => 'full-width',
									'style' => 'display:block;max-width:100%;height:auto;'
								))
							!!}
						@else
							{!! Html::image( url('/') . $module_params['placeholder_image'],
								'hero-image', 
								array(
									'title' => 'hero-image', 
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
	</td>
</tr>