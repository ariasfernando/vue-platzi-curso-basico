@extends('layouts.master')

@section('content')

	<div id="campaign">
	    <campaign campaign-id="{{ $params['campaign_id'] }}"></campaign>
    </div>

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/jquery.js')) }}"></script>
    <script src="{{ cdn(elixir('js/bootstrap.js')) }}"></script>
    <script src="{{ cdn(elixir('js/tinymce.js')) }}"></script>
    <script src="{{ cdn(elixir('js/application-utils-v2.js')) }}"></script>
    <script src="{{ cdn( elixir('js/campaign-components.js') ) }}"></script>
@stop