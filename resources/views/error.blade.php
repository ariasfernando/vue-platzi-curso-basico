@extends('layouts.public')

@section('content')

	<div class="col-xs-12" id="error">
		<h1>Error</h1>
		@if (isset($params['error_message']))
			<h2>{{ $params['error_message'] }}</h2>
		@endif
	</div>

@endsection
