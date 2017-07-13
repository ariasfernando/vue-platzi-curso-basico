@extends('layouts.master')

@section('content')

	<div class="col-xs-12" id="campaign">
	    <campaign campaign-id="{{ $params['campaign_id'] }}"></campaign>
    </div>
	{{-- MODALS --}}
	@include('partials.campaign.modal_campaign_plain_text')
	@include('partials.campaign.modal_campaign_processed')
	@include('partials.campaign.modal_campaign_preview')
	@include('partials.campaign.modal_campaign_finished')

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/library-v2.js')) }}"></script>
	<script src="{{ cdn( elixir('js/campaign-components.js') ) }}"></script>
@stop