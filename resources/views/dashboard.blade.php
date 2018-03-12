@extends('layouts.master')

@section('content')

	<div class="col-xs-12" id="dashboard">
		<dashboard
			:config="{{json_encode(config('campaign'))}}"
			:proof-config="{{json_encode(array_merge(config('proof'), [ 'allow' => (Auth::user()->can('edit_proof') || Auth::user()->can('access_proof')) ]))}}"
		></dashboard>
	</div>

	{{-- MODALS --}}
	@include('partials.proof.modal_proof')

@endsection

@section('footer-script')
    <script src="{{ cdn(mix('js/jquery.js')) }}"></script>
    <script src="{{ cdn(mix('js/bootstrap.js')) }}"></script>
    <script src="{{ cdn(mix('js/tinymce.js')) }}"></script>
    <script src="{{ cdn(mix('js/application-utils-v2.js')) }}"></script>
	<script src="{{ cdn(mix('js/dashboard-components.js')) }}"></script>
	<script src="{{ cdn(mix('js/dashboard-proof.js')) }}"></script>
@stop
