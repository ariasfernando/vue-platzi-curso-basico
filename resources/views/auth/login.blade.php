{{-- Extend public layout --}}
@extends('layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

{{-- Login content --}}
@section('content')
    <section class="col-md-4 col-sm-10 col-xs-10 beta-login">

        <div class="text-center">
            <a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">stensul</a>
            <h4>
                Email Creator
            </h4>
        </div>

        {{-- Login error message --}}

        <div class="text-center">
            <form class="form-horizontal" role="form" method="POST" action="{{ url('/auth/login') }}">
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
                     @else
                        <div class="alert alert-danger" role="alert">
                            <strong>Whoops!</strong> There were some problems with your input.
                        </div>
                    @endif
                @endif

                <div class="form-group">
                    <input type="email" class="form-control" placeholder="Email Address" name="email" value="{{ old('email') }}">
                </div>

                <div class="form-group">
                    <input type="password" placeholder="Password" class="form-control" name="password">
                    <div class="sublink"><a href="{{ url('/password/email') }}">Forgot password?</a></div>
                </div>

                @if ( isset($challenge_provider) )
                    {{-- Challenge --}}
                    @include('auth.partials.' . $challenge_provider)
                @endif


                <div class="form-group submit-row">
                    <div class="text-center">
                        <button type="submit" class="btn">Login</button>
                        @if ( env('USER_REGISTRATION', true) )
                            <a href="register" class="register">Don't have a user? Register here.</a>
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
