{{-- Extend master layout --}}
@extends('base.admin.layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

{{-- Login content --}}
@section('content')
	<section class="col-xs-12">

		<div class="text-center">
			<a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">Admin - Stensul</a>
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
					<label>E-Mail Address</label>
					<div>
						<input type="email" class="form-control" name="email" value="{{ old('email') }}">
					</div>
				</div>

				<div class="form-group">
					<label>Password</label>
					<div class="row">
						<input type="password" class="form-control" name="password">
					</div>
				</div>


				<div class="form-group submit-row">
					<div class="text-center">
						<button type="submit" class="btn">Login</button>
					</div>
				</div>
			</form>

		</div>
	</section>
@endsection
