{{-- Extend master layout --}}
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
            <form class="form-horizontal" role="form">

                @if (session("message"))
                    <div class="alert alert-danger" role="alert">
                        <strong>Whoops!</strong> {{session("message")}}
                    </div>
                @endif
                <div class="form-group submit-row">
                    <div class="text-center">
                        <button type="button" class="login-btn">Login</button>
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
<!-- Scripts -->
@endsection
@include('base/partials/application_script')
@section('footer-script')
    <script src="{{ cdn(elixir('js/library.js')) }}"></script>
@stop
