@extends('layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

@section('content')

    <section class="col-md-4 col-sm-10 col-xs-10 beta-login">

        <div class="text-center">
            <a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">stensul</a>
            <h4>
                Reset Password
            </h4>
        </div>

        <div class="text-center">
            <form class="form-horizontal" role="form" method="POST" action="{{ url('/password/reset') }}">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                <input type="hidden" name="token" value="{{ $token }}">
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
                <div class="form-group">
                    <input type="email" class="form-control" placeholder="Email Address" name="email" value="{{ old('email') }}">
                </div>

                <div class="form-group">
                    <input type="password" class="form-control validate-password" placeholder="New Password" name="password">
                    @include('auth.progress_bar')
                </div>

                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Confirm Password" name="password_confirmation">
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-default">Reset Password</button>
                </div>
            </form>
        </div>

    </section>

@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/library.js') ) }}"></script>
@stop
