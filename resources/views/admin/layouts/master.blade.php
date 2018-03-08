<?php $main_class = (strpos($view_name,'login') !== false)? "base-auth-login" : "base-admin"; ?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<title>Email Creation Platform</title>
		<link href="{{ cdn(mix('css/admin.css')) }}" rel="stylesheet">
		@section('master-head')
		@show

		{{-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries --}}
		{{-- WARNING: Respond.js doesn't work if you view the page via file:// --}}
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body class="<?php echo $main_class; ?>">

		@include('partials.metrics')

		@section('header')
			@include('admin.partials.header')
		@show

		@include('admin.partials.sidebar')

		<div class="admin-container">
			{{-- HEADER --}}
			{{-- CONTENT --}}
			<div class="container-fluid">
				{{-- ALERT CONTAINER --}}
				@include('admin.partials.alert')
				<div class="row">
					{{-- Content --}}
					@yield('content')
				</div>
			</div>

			{{-- Modal spinner --}}
			@include('partials.modal_spinner')
			{{-- Modal Confirm --}}
			@include('partials.modal_confirm')

			{{-- Scripts --}}
			<script src="{{ cdn(mix('js/library.js')) }}"></script>

			{{-- Global Application JS object --}}
			@include('partials/application_script')

			@section('footer-script')

			@show
		</div>
	</body>
</html>
