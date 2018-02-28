{{-- Extend master layout --}}
@extends('layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

{{-- Login content --}}
@section('content')
    <section class="col-md-4 col-sm-10 col-xs-10 beta-login">

        <div class="text-center">
            <a href="/" class="stensul-logo open-sans" target="_blank">stensul</a>
            <h4>
                Email Creation Platform
            </h4>
        </div>

        {{-- Login error message --}}

        <div class="text-center">
            <form class="form-horizontal" role="form">
                @if (session("message"))
                    @if (session("message") == "SUCCESS_REGISTERED")
                        <div class="alert alert-success" role="alert">
                            Your account has been successfully created.
                        </div>
                    @else
                        <div class="alert alert-danger" role="alert">
                            <strong>Whoops!</strong> There were some problems with your input.
                            {{session("message")}}
                        </div>
                    @endif
                @endif
                <div class="form-group submit-row">
                    <div class="text-center">
                        <button type="button" class="login-btn">Login</button>
                        @if ( env('USER_REGISTRATION', false) )
                            <span class="spacer"> &nbsp; </span>
                            <a href="{{ url('/auth/register') }}" class="register">Don't have a user? Register here.</a>
                        @endif
                    </div>
                </div>
            </form>

            <div>
                <p>For access or more information, please email {{$app_config["app_mail_address"]}}</p>
            </div>
        </div>
    </section>
<!-- Scripts -->
@endsection
@include('partials/application_script')
@section('footer-script')
    <script src="{{ cdn(elixir('js/library.js')) }}"></script>
@stop
