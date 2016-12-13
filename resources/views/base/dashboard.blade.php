@extends('base.layouts.master')

@section('content')

	<div class="col-xs-12" id="dashboard">
		<dashboard
			:config="{{ htmlentities( json_encode(config('campaign')), ENT_QUOTES, 'UTF-8' ) }}"
		></dashboard>
	</div>

	{{-- MODALS --}}
	@include('base.partials.dashboard.modal_dashboard_code')

	{{-- VUE TEMPLATES --}}
	@include('base.partials.dashboard.vue_templates')
@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/plugins.js') ) }}"></script>
	<script src="{{ url( elixir('js/dashboard.js') ) }}"></script>
@stop
