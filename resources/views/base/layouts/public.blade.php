<?php $main_class = str_replace('.','-', str_replace( explode('.',$view_name)[0], "base", $view_name ) ). " " . str_replace('.','-', $view_name); ?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<title>Email Creator</title>

		<link href="{{  url( elixir('css/base.css') ) }}" rel="stylesheet">
		
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body class="<?php echo $main_class; ?>">

		@include('base.partials.metrics')

		{{-- HEADER --}}
		@section('header')
			@include('base.partials.header')
		@show

		{{-- CONTENT --}}
		<div class="container">
			<div class="row">
				{{-- Content --}}
				@yield('content')
			</div>
		</div>

		{{-- Debug --}}
		@include('base/layouts/partials/debug')

		@section('footer-script')
		@show
	</body>
</html>
