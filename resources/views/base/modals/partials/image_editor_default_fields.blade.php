{{-- Default Fields --}}
<div class="{{ ( isset($params['destination_url']) && $params['destination_url'] == 'enabled' && isset($params['alt_text']) && $params['alt_text'] == 'enabled' )? 'modal-two-column':'' }}">
	{{-- Input destination url image --}}
	@if ( isset($params["destination_url"]) && $params["destination_url"] == "enabled" )
		<div class="modal-mpf-row">
			{!! Form::label('image-destination-url', 'Destination URL') !!}
			{!! Form::text('destination_url','',array (
				'id'=>'image-destination-url',
				'class' => 'image-destination-url url-format',
				'placeholder' => 'https://www.example.com',
				'data-validation' => '{"required":"true","url":"true"}'))
			!!}
		</div>
	@endif
	
	{{-- Input alt image --}}
	@if ( isset($params["destination_url"]) && $params["destination_url"] == "enabled" )
		<div class="modal-mpf-row">
			{!! Form::label('image-alt-text', 'Alternative text') !!}
			{!! Form::text('alt','', array (
				'id' => 'image-alt-text',
				'class' => 'image-alt-text',
				'placeholder' => 'Enter Alt text here'))
			!!}
		</div>
	@endif
</div>