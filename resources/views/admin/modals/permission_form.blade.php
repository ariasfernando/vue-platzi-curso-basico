<div class="modal-mpf-content-data simple-text-config admin-permission-form">
	<h1>{{ $params['title'] }}</h1>

	{!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-permission-form' )) !!}

		{!! Form::hidden('permissionId', (isset($params['permission']['_id']))? $params['permission']['_id'] : 0) !!}

		{{-- Input Name --}}
		<div class="modal-mpf-row">
			<label>Name</label>
			{!! Form::text('name', (isset($params['permission']['name']))? $params['permission']['name'] : '', array (
				'class' => 'permission_name',
				'id' => 'permission_name',
			)) !!}
		</div>

		{{-- Input Description --}}
		<div class="modal-mpf-row">
			<label>Description</label>
			{!! Form::text('description',(isset($params['permission']['description']))? $params['permission']['description'] : '', array (
				'class' => 'permission_description',
				'id' => 'permission_description'
			)) !!}
		</div>

		{{-- Input submit  --}}
		<div class="modal-mpf-submit">
			{!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
		</div>

	{!! Form::close() !!}
</div>