<div class="modal-mpf-content-data simple-text-config">
	<h1>Choose Font Color</h1>
	
	{!! Form::open ( array ( 'method' => 'post', 'files' => true ,'id' => 'line-of-text'  )) !!}
		
		<!-- Color Picker Field Fields -->
		@include('base.modals.partials.color_picker', array(
			'label' => 'Font color',
			'field_name' => 'font-color',
			'data_color' => '#FF5555'
		))

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>
		
	{!! Form::close() !!}
</div>