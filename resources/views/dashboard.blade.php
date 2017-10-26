@extends('layouts.master')

@section('content')

	<div class="col-xs-12" id="dashboard">
		<dashboard
			:config="{{ htmlentities( json_encode(config('campaign')), ENT_QUOTES, 'UTF-8' ) }}"
			:proof-config="{{ htmlentities( json_encode(array_merge(config('proof'), [ 'allow' => (Auth::user()->can('edit_proof') || Auth::user()->can('access_proof')) ])), ENT_QUOTES, 'UTF-8' ) }}"
		></dashboard>
	</div>

	{{-- MODALS --}}
	@include('partials.dashboard.modal_dashboard_code')
	@include('partials.proof.modal_proof')

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/library.js')) }}"></script>
	<script src="{{ cdn(elixir('js/dashboard-components.js')) }}"></script>
@stop
