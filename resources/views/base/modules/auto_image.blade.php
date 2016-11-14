<?php
	if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
		$image = $module_params['data']['image0'];
	}
?>

<tr data-params='{{json_encode($module_params)}}'>
	<td align="center" style="vertical-align:middle;">
		<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
			<tr>
				<td style="vertical-align:top;"
					width="100%"
				    valign="top"
				    align="center"
				    bgcolor="#ffffff"
				>
					<a href="{{ isset($image['destination_url'])? $image['destination_url'] : '#' }}"
					   data-master-image-editor="auto_image"
					   >
						@if ( !empty($image['path']) )
							{!! Html::image( url('/') . "/images/campaigns". $image['path'],
								( isset($image['alt']) )? $image['alt']:'',
								array(
									'title' => ( isset($image['alt']) )? $image['alt']:'',
									'border' => '0',
									'class' => 'display-mobile',
									'style' => 'display:block;border:none;max-width:100%;'
								))
							!!}
						@else
							{!! Html::image( url('/') . $module_params['placeholder_image'],
								'full-width-image',
								array(
									'title' => 'full-width-image',
									'border' => '0',
									'style' => 'display:block;border:none;max-width:100%;'
								))
							!!}
						@endif
					</a>
				</td>
			</tr>
		</table>
	</td>
</tr>
