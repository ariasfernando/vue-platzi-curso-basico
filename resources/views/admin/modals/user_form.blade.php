<div class="modal-mpf-content-data simple-text-config admin-user-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-user-form' )) !!}

		{!! Form::hidden('userId', (isset($params['user']['_id']))? $params['user']['_id'] : 0) !!}

		<!-- Input Name -->
		<div class="modal-mpf-row">
			<label>First Name</label>
			{!! Form::text('name', (isset($params['user']['name']))? $params['user']['name'] : '', array (
				'class' => 'user_name',
                'id' => 'user_name',
                'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<!-- Input LastName -->
		<div class="modal-mpf-row">
			<label>Last Name</label>
			{!! Form::text('last_name',(isset($params['user']['last_name']))? $params['user']['last_name'] : '', array (
				'class' => 'user_last_name',
                'id' => 'user_last_name',
                'data-validation' => '{"required":"true"}'
			)) !!}
		</div>

		<!-- Input Email -->
		<div class="modal-mpf-row">
			<label>Email</label>
			{!! Form::email('email',(isset($params['user']['email']))? $params['user']['email'] : '', array (
				'class' => 'user_email',
				'id' => 'user_email',
				'data-validation' => '{"required":"true", "email":"true"}'
			)) !!}
		</div>

		@if (Auth::user()->can('allows_role_change'))
			<!-- Select Role -->
			<div class="modal-mpf-row selector">
				<label>Select Role</label>
				{!!
					Form::select(
						'roles',
						$params['roles'],
						isset($params['user']['roles']) ? $params['user']['roles'] : '',
						[
							'class' => 'form-control selectpicker roles-list',
							'id' => 'roles',
							'name' => 'roles[]',
							'multiple' => 'true',
							'title' => '',
							'data-validation' => '{"required":"true"}'
						]
					);
				!!}
			</div>
		@endif

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>
