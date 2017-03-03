<div class="modal-mpf-content-data simple-text-config admin-user-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-user-form' )) !!}

		{!! Form::hidden('userId', (isset($params['user']['_id']))? $params['user']['_id'] : 0) !!}

		<!-- Input Name -->
		<div class="modal-mpf-row">
			{!! Form::label('name', 'Name') !!}
			{!! Form::text('name', (isset($params['user']['name']))? $params['user']['name'] : '', array (
				'class' => 'user_name',
				'id' => 'user_name',
				'placeholder' => 'Enter name here.'
			)) !!}
		</div>

		<!-- Input LastName -->
		<div class="modal-mpf-row">
			{!! Form::label('last_name', 'Last Name') !!}
			{!! Form::text('last_name',(isset($params['user']['last_name']))? $params['user']['last_name'] : '', array (
				'class' => 'user_last_name',
				'id' => 'user_last_name',
				'placeholder' => 'Enter last name here.'
			)) !!}
		</div>

		<!-- Input Email -->
		<div class="modal-mpf-row">
			{!! Form::label('email', 'Email') !!}
			{!! Form::email('email',(isset($params['user']['email']))? $params['user']['email'] : '', array (
				'class' => 'user_email',
				'id' => 'user_email',
				'placeholder' => 'Enter email here.',
				'data-validation' => '{"required":"true", "email":"true"}'
			)) !!}
		</div>

		<!-- Select Role -->
		<div class="modal-mpf-row selector">
			{!! Form::label('roles', 'User roles') !!}
			{!! Form::select('roles', $params['roles'], (isset($params['user']['roles']))? $params['user']['roles'] : '',array (
				'class' => 'form-control selectpicker',
				'id' => 'roles',
				'name' => 'roles[]',
				'multiple' => 'true',
				'title' => 'Choose one or more roles ...',
				'data-validation' => '{"required":"true"}'
			)); !!}
		</div>

		<!-- Input submit  -->
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>
