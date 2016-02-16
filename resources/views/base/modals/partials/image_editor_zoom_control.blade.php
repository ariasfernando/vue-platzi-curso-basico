{{-- Zoom Control --}}
@if ( $params["image_crop"] == "enabled" )
	<div class="section-box-zoom modal-mpf-row">
		<div class="container-canvas relative">
			<div class="disabled-zoom"></div>
			<label>Image zoom:</label>
			<div class="canvas-zoom-sel"></div>
		</div>
		<input type="hidden" class="cropit-image-zoom-input" />		
	</div>
@endif