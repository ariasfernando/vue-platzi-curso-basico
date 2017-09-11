@extends('layouts.master')

@section('content')

	<div id="campaign">
	    <campaign campaign-id="{{ $params['campaign_id'] }}"></campaign>
    </div>

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/library-v2.js')) }}"></script>
    <script src="{{ cdn(elixir('js/custom-modules.js')) }}"></script>
    <script src="{{ cdn( elixir('js/campaign-components.js') ) }}"></script>
@stop