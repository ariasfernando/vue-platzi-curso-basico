{{-- Extend master layout --}}
@extends('admin.layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

{{-- Login content --}}
@section('content')
	<section class="col-md-4"></section>
	<section class="col-md-4 beta-login">

		<div class="text-center">
			<a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">stensul</a>
			<h4>
				Administration Panel
			</h4>
		</div>

		{{-- Login error message --}}

		<div class="text-center">
			<form class="form-horizontal" role="form" method="POST" action="{{ url('/admin/login') }}">
				<input type="hidden" name="_token" value="{{ csrf_token() }}">

				@if (session("message"))
					@if (session("message") == "ERROR_ADMIN")
						<div class="alert alert-danger" role="alert">
							<strong>Whoops!</strong> You don't have rights to access this area
						</div>
					@else
						<div class="alert alert-danger" role="alert">
							<strong>Whoops!</strong> Your password is incorrect
						</div>
					@endif
				@endif

				<div class="form-group">
					<input type="email" class="form-control" name="email" placeholder="E-Mail Address" value="{{ old('email') }}">
				</div>

				<div class="form-group">
					<input type="password" class="form-control" placeholder="Password" name="password">
				</div>

				<div class="form-group submit-row">
					<div class="text-center">
						<button type="submit" class="btn">Login</button>
					</div>
				</div>
			</form>
		</div>
	</section>
	<section class="col-md-4"></section>
@endsection
