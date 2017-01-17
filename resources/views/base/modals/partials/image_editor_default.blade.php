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

	if( !empty($params['overlays']) ){
		foreach ($params["overlays"] as $overlay){
			if( !empty($overlay['control_id']) ){
				$count ++;
			}
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

			@if( !empty($params['overlays']) )
				@foreach ($params["overlays"] as $overlay)
					@if( !empty($overlay['control_id']) )
						@include('base.modals.partials.overlay_control', array(
							'input_id' => $overlay['control_id'],
							'container_id' => $overlay['control_id'].'-container',
							'label' => $overlay['control_label']
						))
					@endif
				@endforeach
			@endif

			{{-- Image width control --}}
			@include('base.modals.partials.image_editor_width_control')
		</div>

		<div class="section-title"><h2>Preview Image</h2></div>

		<div class="cropit-preview">

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

			{{-- Text overlay --}}
			@if ( isset($params["overlays"]) )
				{{-- Foreach for images --}}
				@foreach ($params["overlays"] as $overlay)
					@if( $overlay["type"] == "image" )
						<img
							id="{{ $overlay["id"] or "" }}"
							src="{{ url('/') }}{{ $overlay["path"] or "" }}"
							class="image-overlay {{ $overlay["class"] or "" }}"
							width="{{ $overlay["width"] or "auto" }}"
							height="{{ $overlay["height"] or "auto" }}"
							border="0"
							style="display:block; border:none;" />
					@endif
				@endforeach

				{{-- Foreach for html elements --}}
				@foreach ($params["overlays"] as $overlay)
					@if( $overlay["type"] == "text" )
						<dir id="{{ $overlay["id"] or "" }}" class="st-html-overlay {{ $overlay["class"] or "" }}">
							<div
								id="{{ $overlay["id"] or "" }}-editor"
								contenteditable="true"
								data-save-as="{{ $overlay["save_as"] or "" }}"
								>{{ $overlay["default"] or "" }}</div>
							<div class="toolbox"></div>
						</dir>
					@elseif( $overlay["type"] == "rich_text" )
						<div class="rich-text-container st-html-overlay" id="{{ $overlay["id"] or "" }}">
							<div
								id="{{ $overlay["id"] or "text" }}-editor"
								class="{{ $overlay["class"] or "" }}"
								data-save-as="{{ $overlay["save_as"] or "" }}"
								>{{ $overlay["default"] or "" }}</div>
							<div class="toolbox rich-text-toolbox"></div>
						</div>
					@endif
				@endforeach
			@endif

		</div>
	</div>
</div>

	
