{{-- Extend public layout --}}
@extends('base.layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

{{-- Login content --}}
@section('content')
    <section class="col-xs-12">

        <div class="text-center">
            <a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">stensul</a>
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
                    <label>Email Address</label>
                    <div>
                        <input type="email" class="form-control" name="email" value="{{ old('email') }}">
                    </div>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <div class="row">
                        <input type="password" class="form-control" name="password">
                    </div>
                    <div class="sublink"><a href="{{ url('/password/email') }}">Forgot password?</a></div>
                </div>


                <div class="form-group submit-row">
                    <div class="text-center">
                        <button type="submit" class="btn">Login</button>
                        @if ( env('USER_REGISTRATION', true) )
                            <span class="spacer"> &nbsp; </span>
                            <a href="register">Register</a>
                        @endif
                    </div>
                </div>
            </form>


            <div class="login-footer"></div>

            <div>
                <p>For access or more information, please email {{$app_config["app_mail_address"]}}</p>
            </div>
        </div>
    </section>
@endsection
