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

    <div class="col-md-7 col-md-offset-3">
        <section class="col-xs-12 section-container">

            <h2 class="page-title">Reset Password</h2>

            <div class="panel-body">
                <form class="form-horizontal" role="form" method="POST" action="{{ url('/password/reset') }}">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input type="hidden" name="token" value="{{ $token }}">

                    <div class="form-group">
                        <label class="col-xs-12 col-sm-4 control-label">Email Address</label>
                        <div class="col-xs-12 col-sm-8">
                            <input type="email" class="form-control" name="email" value="{{ old('email') }}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-xs-12 col-sm-4 control-label">New Password</label>
                        <div class="col-xs-12 col-sm-8">
                            <input type="password" class="form-control validate-password" name="password">
                            @include('base.auth.progress_bar')
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
                            <button type="submit" class="btn btn-default">Reset Password</button>
                        </div>
                    </div>
                </form>
            </div>

        </section>
    </div>
@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/library.js') ) }}"></script>
@stop
