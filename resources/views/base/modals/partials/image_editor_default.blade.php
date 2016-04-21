<?php
	$attrId = ( isset($params["image_crop"]) && $params["image_crop"] == "enabled" )? 'id=image-cropper':'';
	$initCropperClass = ( isset($params["image_crop"]) && $params["image_crop"] == "enabled")? 'init-cropper':'';
	$attrTabpanel = ( isset($params["image_crop"]) && $params["image_crop"] == "enabled" && isset($params["multi_crop"]) && $params["multi_crop"] == "enabled")? 'role=tabpanel':'';
	$tabClass = ( isset($params["image_crop"]) && $params["image_crop"] == "enabled" && isset($params["multi_crop"]) && $params["multi_crop"] == "enabled")? 'tab-pane active':'';

	$two_col_format = false;
	$keys_arr = ["image_crop","image_overlay","adjustable_height","adjustable_width"];
	$count = 0;
	foreach ($keys_arr as $key) {
		if( isset($params[$key]) && $params[$key] == "enabled" ){
			$count ++;
		}
	}
	if($count>1){
		$two_col_format = true;
	}

    // Image Overlay Class
    $image_overlay_class = 'image-overlay';
    if( isset($params["image_overlay_config"]["image_class"]) ){
        $image_overlay_class = 'image-overlay ' . $params["image_overlay_config"]["image_class"];
    }
?>

<div {{ $attrId }}  {{ $attrTabpanel }} class="{{ $tabClass }} {{ $initCropperClass }}" >

	{{-- Image Preview --}}
	<div class="section-box preview-box">

		<div class="{{ ($two_col_format)? 'modal-two-column':'' }}">
			{{-- Image Zoom --}}
			@include('base.modals.partials.image_editor_zoom_control')

			{{-- Image height control --}}
			@include('base.modals.partials.image_editor_height_control')

			{{-- Image overlay control --}}
			@include('base.modals.partials.image_editor_image_overlay_control')

			{{-- Image width control --}}
			@include('base.modals.partials.image_editor_width_control')
		</div>

		<div class="section-title"><h2>Preview Image</h2></div>

		<div class="cropit-image-preview">

			{{-- Image overlay --}}
			@if ( isset($params["image_overlay"]) && $params["image_overlay"] == "enabled" )
				{!! Html::image(
					$params["image_overlay_config"]["image_path"],
					$params["image_overlay_config"]["image_alt"],
					array(
						'title' => $params["image_overlay_config"]["image_alt"],
						'width' => $params["image_overlay_config"]["image_width"],
						'height'=> $params["image_overlay_config"]["image_height"],
						'border' => '0',
						'class' => $image_overlay_class,
						'style' => 'display:block; border:none;'
				)) !!}
			@endif

			{{-- Text overlay --}}
			@if ( isset($params["text_overlay"]) && $params["text_overlay"] == "enabled" )
				<div id="text-overlay" class="text-overlay">
					<div class="prevent-overflow"><div id="text-editable" class="text-editable">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</div></div>
				</div>
			@endif

		</div>
	</div>
</div>

	