{{-- Extend public layout --}}
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
                {{$is_admin or false ? 'Administration Panel' : 'Email Generation Platform'}}
            </h4>
        </div>

        {{-- Login error message --}}

        <div class="text-center">
            <form class="form-horizontal" role="form" method="POST" action="{{ $is_admin or false ? url('/admin/login') : url('/auth/login') }}">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">

                @if (session("message"))
                    @if (session("message") == "SUCCESS_CHANGE")
                        <div class="alert alert-success" role="alert">
                            Your password was successfully changed, please login again.
                        </div>
                    @elseif (session("message") == "SUCCESS_REGISTERED")
                         <div class="alert alert-success" role="alert">
                             Your account has been successfully created.
                         </div>
                    @elseif (session("message") == "ERROR_CAPTCHA")
                        <div class="alert alert-danger" role="alert">
                            Please confirm you are not a robot.
                        </div>
                    @else
                        <div class="alert alert-danger" role="alert">
                            Invalid email address and / or password.
                        </div>
                    @endif
                @endif

                <div class="form-group">
                    <input type="email" class="form-control" placeholder="Email Address" name="email" value="{{ old('email') }}" id="emailText">
                </div>

                <div class="form-group">
                    <input type="password" placeholder="Password" class="form-control" name="password" id="passwordText">
                </div>

                @if ( isset($challenge_provider) )
                    {{-- Challenge --}}
                    @include('auth.partials.' . $challenge_provider)
                @endif

                <div class="form-group submit-row">
                    <div class="text-center">
                        <button type="submit" class="btn" id="loginButton" >Login</button >
                        <div class="sublink"><a href="{{ url('/password/email') }}" id="forgotPasswordLink">Forgot password?</a></div >
                        @if ( env('USER_REGISTRATION', false) )
                            <a href="{{ url('/auth/register') }}" class="register" id="registerNewUserLink">Don't have a user? Register here.</a >
                        @endif
                    </div>
                </div>
            </form>
            <div>
                <p class="app-email">For access or more information, please email {{$app_config["app_mail_address"]}}</p>
            </div>
        </div>
    </section>
@endsection
