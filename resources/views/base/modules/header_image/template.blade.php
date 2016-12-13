<?php
	if( isset($module_params['data']['image0']) && !empty($module_params['data']['image0']) ){
		$image = $module_params['data']['image0'];
	}

    $image_path = url($module_params['placeholder_image']);
    if ( isset($image['path']) && !empty($image['path']) ) {
        $image_path = url("/images/campaigns". $image['path']);
    }
?>

{{-- Header Image: Start --}}
<tr data-params='{{json_encode($module_params)}}'>
	<td class="border-color" bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%">
		<a href="{{ $image['destination_url'] or '#' }}" data-master-image-editor="header">

            {!! Html::image( $image_path, isset($image['alt']) ? $image['alt'] : '', array(
                'title' => ( isset($image['alt']) ) ? $image['alt']:'',
                'align' => 'center',
                'width' => $params['campaign_data']->getLibraryConfig('template_width'),
                'class' => 'center-on-narrow',
                'style' => 'border: 0; width: 100%; max-width: ' . $params['campaign_data']->getLibraryConfig('template_width') . 'px; height: auto'
            )) !!}

		</a>
	</td>
</tr>
{{-- Header Image: End --}}
