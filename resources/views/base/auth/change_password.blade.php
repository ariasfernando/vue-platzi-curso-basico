@extends('base.layouts.public')

@section('content')

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

	<div class="col-md-6 col-md-offset-3">
		<section class="col-xs-12 section-container">
			<h2 class="page-title">Change Password</h2>
			<div class="panel-body">
				<form class="form-horizontal" role="form" method="POST" action="{{ url('/password/change') }}">
					<input type="hidden" name="_token" value="{{ csrf_token() }}">

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">Old password</label>
						<div class="col-xs-12 col-sm-8">
							<input type="password" class="form-control" name="old_password">
						</div>
					</div>

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">New Password</label>
						<div class="col-xs-12 col-sm-8">
							<input type="password" class="form-control" name="password">
						</div>
					</div>

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">Confirm Password</label>
						<div class="col-xs-12 col-sm-8">
							<input type="password" class="form-control" name="password_confirmation">
						</div>
					</div>

					<div class="form-group">
						<div class="col-xs-12 col-sm-offset-4">
							<button type="submit" class="btn btn-default">Change Password</button>
						</div>
					</div>
				</form>
			</div>

		</section>
	</div>
@endsection
