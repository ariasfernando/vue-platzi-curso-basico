@extends('layouts.public')

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

			<h2 class="page-title">Register</h2>

			<div class="panel-body">
				<form class="form-horizontal" role="form" method="POST" action="{{ url('/auth/register') }}">
					<input type="hidden" name="_token" value="{{ csrf_token() }}">
					<input type="hidden" name="force_password" value="0">

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">Name</label>
						<div class="col-xs-12 col-sm-8">
							<input type="text" class="form-control" name="name" value="{{ old('name') }}">
						</div>
					</div>

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">E-Mail Address</label>
						<div class="col-xs-12 col-sm-8">
							<input type="email" class="form-control" name="email" value="{{ old('email') }}">
						</div>
					</div>

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">Password</label>
						<div class="col-xs-12 col-sm-8">
							<input type="password" class="form-control validate-password" name="password">
							@include('auth.progress_bar')
						</div>
					</div>

					<div class="form-group">
						<label class="col-xs-12 col-sm-4 control-label">Confirm Password</label>
						<div class="col-xs-12 col-sm-8">
							<input type="password" class="form-control" name="password_confirmation">
						</div>
					</div>

					<div class="form-group selector">
						<label class="col-xs-12 col-sm-4 control-label">Roles</label>
						<div class="col-xs-12 col-sm-8">
							<select name="roles[]" class="form-control selectpicker" multiple title="Choose one or more roles ...">
								@foreach ($roles as $role)
			                        <option value="{{ $role }}">{{ $role }}</option>
			                    @endforeach
		                    </select>
						</div>
					</div>

					<div class="form-group">
						<div class="col-xs-12 col-sm-offset-4">
							<button type="submit" class="btn btn-default">Register</button>
						</div>
					</div>
				</form>
			</div>

		</section>
	</div>
@endsection

@section('footer-script')
	<script src="{{ cdn(elixir('js/library.js')) }}"></script>
@stop
