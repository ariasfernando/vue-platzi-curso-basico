<?php
	$attrId = ($params["image_crop"] == "enabled" )? 'id=image-cropper':'';
	$initCropperClass = ($params["image_crop"] == "enabled")? 'init-cropper':'';
	$attrTabpanel = ($params["image_crop"] == "enabled" && $params["multi_crop"] == "enabled")? 'role=tabpanel':'';
	$tabClass = ($params["image_crop"] == "enabled" && $params["multi_crop"] == "enabled")? 'tab-pane active':'';
?>

<div {{ $attrId }}  {{ $attrTabpanel }} class="{{ $tabClass }} {{ $initCropperClass }}" >

	{{-- Image Preview --}}
	<div class="section-box preview-box">

		<div class="{{ ( $params['image_crop'] == 'enabled' && $params['image_overlay'] == 'enabled' )? 'modal-two-column':'' }}">
			{{-- Image Zoom --}}
			@include('base.modals.partials.image_editor_zoom_control')

			{{-- Image overlay control --}}
			@include('base.modals.partials.image_editor_image_overlay_control')
		</div>

		<div class="section-title"><h2>Preview Image</h2></div>

		<div class="cropit-image-preview">

			{{-- Image overlay --}}
			@if ( $params["image_overlay"] == "enabled" )
				{!! Html::image(
					$params["image_overlay_config"]["image_path"],
					$params["image_overlay_config"]["image_alt"],
					array(
						'title' => $params["image_overlay_config"]["image_alt"],
						'width' => $params["image_overlay_config"]["image_width"],
						'height'=> $params["image_overlay_config"]["image_height"],
						'border' => '0',
						'class' => 'image-overlay',
						'style' => 'display:block; border:none;'
				)) !!}
			@endif

			{{-- Text overlay --}}
			@if ( $params["text_overlay"] == "enabled" )
				<div id="text-overlay" class="text-overlay">
					<div class="prevent-overflow"><div id="text-editable" class="text-editable">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet</div></div>
				</div>
			@endif

		</div>
	</div>
</div>

	