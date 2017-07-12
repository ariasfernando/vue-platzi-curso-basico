<div class="modal-mpf-content-data simple-text-config admin-role-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-role-form' )) !!}

		{!! Form::hidden('roleId', (isset($params['role']['_id']))? $params['role']['_id'] : 0) !!}

		<!-- Input Name -->
		<div class="modal-mpf-row">
			<label>Role Name</label>
			{!! Form::text('name', (isset($params['role']['name']))? $params['role']['name'] : '', array (
				'class' => 'role_name',
				'id' => 'role_name'
			)) !!}
		</div>

		<!-- Input Description -->
		<div class="modal-mpf-row">
			<label>Role Description</label>
			{!! Form::text('description',(isset($params['role']['description']))? $params['role']['description'] : '', array (
				'class' => 'role_description',
				'id' => 'role_description'
			)) !!}
		</div>

		<!-- Select Permissions -->
		<div class="modal-mpf-row selector">
			<label>Select Permission</label>
			{!! Form::select('permissions', $params['permissions'], (isset($params['role']['permissions']))? $params['role']['permissions'] : '',array (
				'class' => 'form-control selectpicker',
				'id' => 'permissions',
				'name' => 'permissions[]',
				'multiple' => 'true',
				'data-validation' => '{"required":"true"}'
			)); !!}
		</div>

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>