{{-- Default Fields --}}
<div class="{{ ( $params['destination_url'] == 'enabled' && $params['alt_text'] == 'enabled' )? 'modal-two-column':'' }}">
	{{-- Input destination url image --}}
	@if ( $params["destination_url"] == "enabled" )
		<div class="modal-mpf-row">
			{!! Form::label('image-destination-url', 'Destination URL') !!}
			{!! Form::text('image-destination-url','',array (
				'class' => 'image-destination-url url-format',
				'placeholder' => 'https://www.example.com',
				'data-validation' => '{"required":"true","url":"true"}'))
			!!}
		</div>
	@endif
	
	{{-- Input alt image --}}
	@if ( $params["destination_url"] == "enabled" )
		<div class="modal-mpf-row">
			{!! Form::label('image-alt-text', 'Alternative text') !!}
			{!! Form::text('image-alt-text','', array (
				'class' => 'image-alt-text',
				'placeholder' => 'Enter Alt text here'))
			!!}
		</div>
	@endif
</div>