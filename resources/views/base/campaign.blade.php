@extends('base.layouts.master')

@section('content')

	<div class="col-xs-12">

		<div class="section-container-campaign">
			<!-- column left (menu) -->
			<aside>
				<div class="menu-campaign">
					@include('base.partials.campaign.configuration')
					@include('base.partials.campaign.menu', array('menu_list' => $params['menu_list']))
				<div>
			</aside>

			<!-- column right (container email) -->
			<section class="section-canvas-email section-box">
				@include('base.partials.campaign.email_canvas')
			</section>
		</div>

	</div>

	{{-- MODALS --}}
	@include('base.partials.campaign.modal_campaign_plain_text')
	@include('base.partials.campaign.modal_campaign_processed')
	@include('base.partials.campaign.modal_campaign_preview')
	@include('base.partials.campaign.modal_campaign_finished')

@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/components.js') ) }}"></script>
    <script src="{{ url( elixir('js/plugins.js') ) }}"></script>
	<script src="{{ url( elixir('js/campaign.js') ) }}"></script>
	<script src="{{ url( elixir('js/modules.js') ) }}"></script>
@stop
