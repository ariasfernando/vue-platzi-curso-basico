@extends('layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

@section('content')

	<section class="col-md-4 col-sm-1 col-xs-1"></section>
	<section class="col-md-4 col-sm-10 col-xs-10 beta-login">
		@if (count($errors) > 0)
			<div class="col-md-6 col-md-offset-3">
				<div class="alert alert-danger">
					<strong>Error:</strong> There were some problems with your input.<br><br>
					<ul>
						@foreach ($errors->all() as $error)
							<li>{{ $error }}</li>
						@endforeach
					</ul>
				</div>
			</div>
		@endif

		<div class="text-center">
            <a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">stensul</a>
            <h4>
               Change Password
            </h4>
        </div>


			<div class="text-center">
				<form class="form-horizontal" role="form" method="POST" action="{{ url('/password/change') }}">
					<input type="hidden" name="_token" value="{{ csrf_token() }}">

					<div class="form-group">
						<input type="password" class="form-control" name="old_password" placeholder="Old password">
					</div>

					<div class="form-group">
						<input type="password" class="form-control validate-password" name="password" placeholder="New Password">
						@include('auth.progress_bar')
					</div>

					<div class="form-group">
						<input type="password" class="form-control" name="password_confirmation" placeholder="Confirm Password">
					</div>

					<div class="form-group">
						<button type="submit" class="btn btn-default">Change Password</button>
					</div>
				</form>
			</div>
	</section>
	<section class="col-md-4 col-sm-1 col-xs-1"></section>
@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/library.js') ) }}"></script>
@stop
