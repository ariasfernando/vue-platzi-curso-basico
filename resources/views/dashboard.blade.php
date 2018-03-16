@extends('layouts.master')

@section('content')

	<div class="col-xs-12" id="dashboard">
		<dashboard
			:config="{{ htmlentities( json_encode(config('campaign')), ENT_QUOTES, 'UTF-8' ) }}"
			:proof-config="{{ htmlentities( json_encode(array_merge(config('proof'), [ 'allow' => (Auth::user()->can('edit_proof') || Auth::user()->can('access_proof')) ])), ENT_QUOTES, 'UTF-8' ) }}"
		></dashboard>
	</div>

	{{-- MODALS --}}
	@include('partials.proof.modal_proof')

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/jquery.js')) }}"></script>
    <script src="{{ cdn(elixir('js/bootstrap.js')) }}"></script>
    <script src="{{ cdn(elixir('js/tinymce.js')) }}"></script>
    <script src="{{ cdn(elixir('js/application-utils-v2.js')) }}"></script>
	<script src="{{ cdn(elixir('js/dashboard-components.js')) }}"></script>
@stop
