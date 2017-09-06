@extends('layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

@section('content')
	<section class="col-md-4"></section>
	<section class="col-md-4 beta-login">
		@if (count($errors) > 0)
		<div class="alert alert-danger">
				<strong>Error:</strong> There were some problems with your input.<br><br>
				<ul>
					@foreach ($errors->all() as $error)
						<li>{{ $error }}</li>
					@endforeach
				</ul>
			</div>
		@endif
		<div class="text-center">
            <a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">stensul</a>
            <h4>
                Register
            </h4>
        </div>

        <div class="text-center">
        	<form class="form-horizontal" role="form" method="POST" action="{{ url('/auth/register') }}">
				<input type="hidden" name="_token" value="{{ csrf_token() }}">
				<input type="hidden" name="force_password" value="0">

				<div class="form-group">
					<input type="text" class="form-control" name="name" placeholder="Name" value="{{ old('name') }}">
				</div>

				<div class="form-group">
					<input type="email" class="form-control" placeholder="Email Address" name="email" value="{{ old('email') }}">
				</div>

				<div class="form-group">
					<input type="password" class="form-control validate-password" placeholder="Password" name="password">
					@include('auth.progress_bar')
				</div>

				<div class="form-group">
					<input type="password" class="form-control" placeholder="Confirm Password" name="password_confirmation">
				</div>

				<div class="form-group selector">
					<select name="roles[]" class="form-control selectpicker" multiple title="Choose one or more roles ...">
						@foreach ($roles as $role)
			                   <option value="{{ $role }}">{{ $role }}</option>
			               @endforeach
		               </select>
				</div>

				<div class="form-group">
					<button type="submit" class="btn btn-default">Register</button>
				</div>
			</form>
        </div>

	</section>
	<section class="col-md-4"></section>

@endsection

@section('footer-script')
	<script src="{{ cdn(elixir('js/library.js')) }}"></script>
@stop
