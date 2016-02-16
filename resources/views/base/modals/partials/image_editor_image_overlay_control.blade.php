{{-- Image Overlay --}}
@if ( $params["image_overlay"] == "enabled" )
	<div id="image-overlay-config" class="modal-mpf-row">
		<label class="switch-light switch-stensul" onclick="">
			{!! Form::checkbox('image-overlay', '', null, array ( 'id' => 'image-overlay', 'checked'=>'checked') )!!}
			<span>Logo overlay<span>Off</span><span>On</span></span>
			<a></a>
		</label>
	</div>
@endif