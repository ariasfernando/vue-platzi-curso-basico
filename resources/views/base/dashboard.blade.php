@extends('base.layouts.master')

@section('content')

	<div class="col-xs-12">
		<section class="col-xs-12 section-container">
			<div class="row">
				<div class="col-xs-12">

					{{-- Language / Style Selector --}}
					<div class="dropdown default-dropdown">
                        @include('base.partials.dashboard.menu')
					</div>

				</div>
			</div>

			<div class="row">
				<div class="col-xs-12">
					<h2 class="crimson italic">Current emails in progress</h2>
					{{-- Current Email in progress Table --}}
					@include('base.partials.dashboard.emails_in_progress', array('campaigns' => $params['campaigns_edited']))
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12">
					<h2 class="crimson italic">Finished emails</h2>
					{{-- Finished Emails Table --}}
					@include('base.partials.dashboard.finished_emails', array('campaigns' => $params['campaigns_processed']))
				</div>
			</div>

		</section>
	</div>

	{{-- MODALS --}}
	@include('base.partials.dashboard.modal_dashboard_code')
@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/plugins.js') ) }}"></script>
	<script src="{{ url( elixir('js/dashboard.js') ) }}"></script>
@stop