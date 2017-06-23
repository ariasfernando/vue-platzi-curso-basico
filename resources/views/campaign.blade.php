@extends('layouts.master')

@section('content')

	<div class="col-xs-12">

		<div class="section-container-campaign">
			<!-- column left (menu) -->
			<aside>
				<div class="menu-campaign">
					@include('partials.campaign.configuration')
					@include('partials.campaign.menu', array('menu_list' => $params['menu_list']))
				<div>
			</aside>

			<!-- column right (container email) -->
			<section class="section-canvas-email section-box">
				@include('partials.campaign.email_canvas')
			</section>
		</div>

	</div>

	{{-- MODALS --}}
	@include('partials.campaign.modal_campaign_plain_text')
	@include('partials.campaign.modal_campaign_processed')
	@include('partials.campaign.modal_campaign_preview')
	@include('partials.campaign.modal_campaign_finished')

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/plugins.js')) }}"></script>
	<script src="{{ cdn(elixir('js/campaign.js')) }}"></script>
	<script src="{{ cdn(elixir('js/modules.js')) }}"></script>
@stop
