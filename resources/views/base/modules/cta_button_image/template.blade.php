<?php
	// Set image
	$imageData = [
		'source' => isset($module_params['placeholder_image'])? url(str_replace('{locale}', $params["campaign_data"]["locale"], $module_params['placeholder_image'])): '',
		'alt' => 'button-place-holder'
	];

	if( isset($module_params['data']['button0']['path']) && !empty($module_params['data']['button0']['path']) ){
		$imageData['source'] = url("/images/campaigns". $module_params['data']['button0']['path']);
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
{{-- CTA Button Image: Start --}}
<tr data-params='{{json_encode($module_params)}}'>
    <td bgcolor="#FFFFFF" align="center" height="100%" valign="top" width="100%">
		<table cellspacing="0" cellpadding="0" border="0" class="center-on-narrow" style="margin-top: 10px !important;">
			<tbody><tr>
				<td class="st-btn button-td" style="border-radius: 3px; background: #222222; text-align: center;">
					<a  href="{{ $module_params['data']['button0']['link'] or '#' }}"
                        target="_blank"
                        class="st-without-event st-cta-button st-validate-href"
                        data-master-button-editor="default_button"
                        style="mso-line-height-rule:exactly;line-height:30px;font-family:{{ $params['campaign_data']->getLibraryConfig('font_family') }};font-size:14px;color:#ffffff;font-weight:normal;text-decoration:none;margin:0px!important;padding:0!important;display:block;">
                        {!! Html::image( $imageData['source'], $imageData['alt'], $imageData['attr'] ) !!}
                    </a>
				</td>
			</tr>
		</tbody></table>
	</td>
</tr>
{{-- CTA Button Image: End --}}
