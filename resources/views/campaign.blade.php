@extends('layouts.master')

@section('content')

	<div id="campaign">
	    <campaign campaign-id="{{ $params['campaign_id'] }}"></campaign>
    </div>
	{{-- MODALS --}}
	@include('partials.campaign.modal_campaign_plain_text')
	@include('partials.campaign.modal_campaign_processed')
	@include('partials.campaign.modal_campaign_preview')
	@include('partials.campaign.modal_campaign_finished')
	@include('partials.proof.modal_proof')

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/library-v2.js')) }}"></script>
    <script src="{{ cdn(elixir('js/custom-modules.js')) }}"></script>
    <script src="{{ cdn( elixir('js/campaign-components.js') ) }}"></script>
@stop