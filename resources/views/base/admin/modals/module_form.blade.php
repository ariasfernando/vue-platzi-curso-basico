<div class="modal-mpf-content-data simple-text-config admin-module-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-module-form' )) !!}

		{!! Form::hidden('moduleId', (isset($params['module']['module_id']))? $params['module']['module_id'] : 0) !!}

		<!-- Input Name -->
		<div class="modal-mpf-row">
			{!! Form::label('name', 'Title') !!}
			{!! Form::text('name', isset($params['module']['title']) ? $params['module']['title'] : '', array (
				'class' => 'module-title',
				'id' => 'module_title',
				'placeholder' => 'Enter name here.'
			)) !!}
		</div>

		<!-- Input Description -->
		<div class="modal-mpf-row">
			{!! Form::label('description', 'Module ID') !!}
			{!! Form::text('description', isset($params['module']['module_id'])? $params['module']['module_id'] : '', array (
				'class' => 'module-id',
				'id' => 'module_id',
				'name' => 'module_id',
				'placeholder' => 'Enter description here.'
			)) !!}
		</div>

		<!-- Select modules -->
		<div class="modal-mpf-row selector">
			{!! Form::label('parent_module', 'Parent Module') !!}
			{!! Form::select('modules', $params['modules'], isset($params['module']['modules']) ? $params['module']['modules'] : '',array (
				'class' => 'form-control selectpicker',
				'id' => 'parent_module',
				'name' => 'parent_module',
				'title' => 'Choose one module to duplicate',
				'data-validation' => '{"required":"true"}'
			)); !!}
		</div>

		<!-- Input config -->
		<div class="modal-mpf-row">
			{!! Form::label('config', 'Config') !!}
			{!! Form::textarea('config', isset($params['module']['config'])
				? json_encode($params['module']['config'], JSON_PRETTY_PRINT) : '', array (
				'class' => 'module-config',
				'id' => 'module_config',
				'name' => 'module_config',
				'placeholder' => 'Enter config here.'
			)) !!}
		</div>

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>