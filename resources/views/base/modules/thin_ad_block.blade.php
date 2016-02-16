<?php
	$module_params = $app_config["modules"]["thin_ad_block"];

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
		<table
			   width="<?php echo $module_params['image_size']['image0']['width']; ?>"
			   cellpadding="0" 
			   cellspacing="0" 
			   border="0" 
		>
			<tr>
				<td style="vertical-align:top;"
					width="100%"
					height="<?php echo $module_params['image_size']['image0']['height']; ?>" 
					valign="top" 
					align="center" 
					bgcolor="#ffffff"
				>
					<a href="{{ isset($image['destination_url'])? $image['destination_url'] : '#' }}" data-master-image-editor="thinAd" style="max-width:<?php echo $module_params['image_size']['image0']['width']; ?>px;">
						@if ( isset($image['path']) && !empty($image['path']) )
							{!! Html::image( url() . "/images/campaigns". $image['path'],
								( isset($image['alt']) )? $image['alt']:'',
								array(
									'title' => ( isset($image['alt']) )? $image['alt']:'',
									'border' => '0',
									'data-image' => '',
									'style' => 'display:block;max-width:100%;max-height:100%;'
								)) 
							!!}
						@else
							{!! Html::image( url() . $module_params['placeholder_image'],
								'thin-ad-block',
								array(
									'title' => 'thin-ad-block',
									'border' => '0',
									'data-image' => '',
									'style' => 'display:block;max-width:100%;max-height:100%;'
								)) 
							!!}
						@endif
					</a>
				</td>
			</tr>
		</table>
	</td>
</tr>