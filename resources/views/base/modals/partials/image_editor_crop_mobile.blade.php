<?php
	$attrId = ($params["image_crop"] == "enabled" && $params["multi_crop"] == "enabled" )? 'id=image-cropper-mobile':'';
	$initCropperClass = ($params["image_crop"] == "enabled")? 'init-cropper':'';
	$attrTabpanel = ($params["image_crop"] == "enabled" && $params["multi_crop"] == "enabled")? 'role=tabpanel':'';
	$tabClass = ($params["image_crop"] == "enabled" && $params["multi_crop"] == "enabled")? 'tab-pane':'';
?>

<div {{ $attrId }}  {{ $attrTabpanel }} class="{{ $tabClass }} {{ $initCropperClass }}" >

	{{-- Image Preview --}}
	<div class="section-box preview-box">

		<div class="{{ ( $params['image_crop'] == 'enabled' &&  $params['image_overlay'] == 'enabled' || $params['adjustable_height'] == 'enabled' )? 'modal-two-column':'' }}">
			{{-- Image Zoom --}}
			@include('base.modals.partials.image_editor_zoom_control')

			{{-- Image height control --}}
			@include('base.modals.partials.image_editor_height_control')

		</div>

		<div class="section-title"><h2>Preview Image</h2></div>

		<div class="cropit-image-preview"></div>
	</div>

</div>