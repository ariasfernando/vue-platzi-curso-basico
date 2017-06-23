@extends('layouts.master')

@section('content')

	<div class="col-xs-12" id="dashboard">
		<dashboard
			:config="{{ htmlentities( json_encode(config('campaign')), ENT_QUOTES, 'UTF-8' ) }}"
		></dashboard>
	</div>

	{{-- MODALS --}}
	@include('partials.dashboard.modal_dashboard_code')
	@include('partials.modal_campaign_preview')

	{{-- VUE TEMPLATES --}}
	@include('partials.dashboard.vue_templates')
@endsection

@section('footer-script')
	<script src="{{ cdn(elixir('js/plugins.js')) }}"></script>
	<script src="{{ cdn(elixir('js/dashboard.js')) }}"></script>
@stop
