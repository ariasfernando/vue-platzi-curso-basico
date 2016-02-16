<div class="modal-mpf-content-data">
	<h1>Upload new Pretext</h1>
	{!! Form::open ( array ( 'method' => 'post', 'files' => true )) !!}
		<!-- Input pretext -->
		<div class="modal-mpf-row">
			{!! Form::label('header-pretext', 'Pretext') !!}
			{!! Form::text('header-pretext','', array ( 'class' => 'header-pretext', 'placeholder' => 'Lorem ipsum dolor sit amet' )) !!}
		</div>
		
		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right' )) !!}
		</div>
	{!! Form::close() !!}
</div>
