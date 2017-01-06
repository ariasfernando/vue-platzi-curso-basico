<div class="modal-mpf-content-data simple-text-config admin-module-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-module-form' )) !!}

		{!! Form::hidden('moduleId', (isset($params['module']['module_id']))? $params['module']['module_id'] : 0) !!}

		<div class="modal-mpf-row">
			{!! Form::label('module_title', 'Title') !!}
			{!! Form::text('module_title', isset($params['module']['title']) ? $params['module']['title'] : '', array (
				'class' => 'module-title',
				'id' => 'module_title',
				'placeholder' => 'Enter module title here.',
				'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<div class="modal-mpf-row">
			{!! Form::label('module_id', 'Module ID') !!}
			{!! Form::text('module_id', isset($params['module']['module_id'])? $params['module']['module_id'] : '', array (
				'class' => 'module-id',
				'id' => 'module_id',
				'placeholder' => 'Enter module ID here.',
				'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<div class="modal-mpf-row">
			{!! Form::label('module_description', 'Module description') !!}
			{!! Form::text('module_description', isset($params['module']['module_id'])? $params['module']['module_id'] : '', array (
				'class' => 'module-description',
				'id' => 'module_description',
				'placeholder' => 'Enter module description here.',
				'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<div class="modal-mpf-row selector">
			{!! Form::label('parent_module', 'Parent Module') !!}
			{!! Form::select('parent_module', $params['modules'], isset($params['module']['modules']) ? $params['module']['modules'] : '',array (
				'class' => 'form-control selectpicker',
				'id' => 'parent_module',
				'title' => 'Choose one module to duplicate',
				'data-validation' => '{"required":"true"}'
			)); !!}
		</div>

		<div class="modal-mpf-row">
			{!! Form::label('module_config', 'Config') !!}
			{!! Form::textarea('module_config', isset($params['module']['config'])
				? json_encode($params['module']['config'], JSON_PRETTY_PRINT) : '', array (
				'class' => 'module-config',
				'id' => 'module_config',
				'placeholder' => 'Enter config JSON here.',
				'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>