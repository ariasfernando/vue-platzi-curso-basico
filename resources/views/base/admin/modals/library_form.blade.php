<div class="modal-mpf-content-data simple-text-config admin-library-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-library-form' )) !!}

		{!! Form::hidden('libraryId', (isset($params['library']['_id']))? $params['library']['_id'] : 0) !!}

		<!-- Input Name -->
		<div class="modal-mpf-row">
			{!! Form::label('name', 'Name') !!}
			{!! Form::text('name', (isset($params['library']['name']))? $params['library']['name'] : '', array (
				'class' => 'library_name',
				'id' => 'library_name',
				'placeholder' => 'Enter name here.'
			)) !!}
		</div>

		<!-- Input Description -->
		<div class="modal-mpf-row">
			{!! Form::label('description', 'Description') !!}
			{!! Form::text('description',(isset($params['library']['description']))? $params['library']['description'] : '', array (
				'class' => 'library_description',
				'id' => 'library_description',
				'placeholder' => 'Enter description here.'
			)) !!}
		</div>

		<!-- Select modules -->
		<div class="modal-mpf-row selector">
			{!! Form::label('modules', 'Modules') !!}
			{!! Form::select('modules', $params['modules'], (isset($params['library']['modules'])) ? $params['library']['modules'] : '',array (
				'class' => 'form-control selectpicker',
				'id' => 'modules',
				'name' => 'modules[]',
				'multiple' => 'true',
				'title' => 'Choose one or more modules ...',
				'data-validation' => '{"required":"true"}'
			)); !!}
		</div>

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>