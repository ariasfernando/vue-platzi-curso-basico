@extends('base.layouts.public')

@section('content')
	@if (count($errors) > 0)
		<div class="col-md-6 col-md-offset-3">
			<div class="alert alert-danger">
				<strong>Error:</strong>
				@foreach ($errors->all() as $error)
					{{ $error }}
				@endforeach
			</div>
		</div>
	@endif

	@if (session('status'))
		<div class="col-md-6 col-md-offset-3">
			<div class="alert alert-success">
				{{ session('status') }}
			</div>
		</div>
	@endif

	<div class="col-md-6 col-md-offset-3">
		<section class="col-xs-12 section-container">

			<h2 class="page-title">Reset Password</h2>

			<div class="panel-body">

				<form class="form-horizontal" role="form" method="POST" action="{{ url('/password/email') }}">
					<input type="hidden" name="_token" value="{{ csrf_token() }}">

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">Email Address</label>
						<div class="col-xs-12 col-sm-8">
							<input type="email" class="form-control" name="email" value="{{ old('email') }}">
						</div>
                        {{-- Challenge --}}
                        <div class="col-xs-12 col-sm-8 reset-captcha">
                            @include('base.auth.partials.' . $challenge_provider)    
                        </div>
					</div>
					<div class="form-group">
						<div class="col-xs-12 col-sm-offset-4">
							<button type="submit" class="btn btn-default">Send Password Reset Link</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
@endsection
