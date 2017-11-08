@extends('layouts.public')

{{-- For an empty header --}}
@section('header')
@stop

@section('content')

    @if (session('status'))
        <div class="col-md-6 col-md-offset-3">
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        </div>
    @endif

    <section class="col-md-4 col-sm-10 col-xs-10 beta-login">
        @if (count($errors) > 0)
            <div class="alert alert-danger">
                 <strong>Error:</strong>
                @foreach ($errors->all() as $error)
                    {{ $error }}
                @endforeach
            </div>
        @endif

        <div class="text-center">
            <a href="https://stensul.com" class="stensul-logo open-sans" target="_blank">stensul</a>
            <h4>
                Reset Password
            </h4>
        </div>

        <div class="text-center">
            <form class="form-horizontal" role="form" method="POST" action="{{ url('/password/email') }}">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">

                <div class="form-group">
                    <input type="email" class="form-control" placeholder="Email Address" name="email" value="{{ old('email') }}">
                </div>
                {{-- Challenge --}}
                @if ( isset($challenge_provider) )
                    <div class="form-group">
                        @include('auth.partials.' . $challenge_provider)
                    </div>
                @endif
                <div class="form-group">
                    <button type="submit" class="btn btn-default">Send Password Reset Link</button>
                </div>
            </form>
        </div>

    </section>

@endsection
