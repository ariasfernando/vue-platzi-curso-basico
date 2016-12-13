<div class="modal-mpf-content-data" id="master-button-editor">
	<h1>{{ $params["title"] }}</h1>
	{!! Form::open ( array ( 'method' => 'post', 'files' => true ,'id' => 'master-image-editor-form'  )) !!}
		
		<!-- Input pretext -->
		<div class="modal-two-column">
			<div class="modal-mpf-row">
				{!! Form::label('button-label', 'Label') !!}
				{!! Form::text('button-label','', array (
					'class' => 'button-label',
					'placeholder' => (isset($params['buttonDefaultLabel']))? $params['buttonDefaultLabel'] : '',
					'data-validation' => '{"required":"true"}'))
				!!}
			</div>

			<div class="modal-mpf-row">
				{!! Form::label('button-link-url', 'Destination URL') !!}
				{!! Form::text('button-link-url','',array (
					'class' => 'button-link-url url-format',
					'placeholder' => 'https://www.example.com',
					'data-validation' => '{"required":"true","url":"true"}'))
				!!}
			</div>
		</div>

		<!-- Button preview -->
		<div class="section-box">
			<div class="section-title"><h2>Preview</h2></div>

			<div class="button-editor-display">
				<div class="master-button">
					<span>Primary Button</span>
				</div>
			</div>
		</div>

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>
	{!! Form::close() !!}
</div>
