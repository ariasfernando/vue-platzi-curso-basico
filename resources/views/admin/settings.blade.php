@extends('admin.layouts.master')

@section('content')

	<div class="col-xs-12" id="admin-setting-container">

		<section class="col-xs-12 section-container">

			<div class="row">
				<div class="col-xs-12">
					<h2 class="pull-left">Global Settings</h2>
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12" style="width: 30%;">
					@if(count($global_settings))
						@foreach ($global_settings as $setting)
							<div class="table-responsive">
								<div class="list-action-container log-action-container">
									<div class="admin-log-tail">
										<label for="onoffswitch" class="clear-label">
											<i class="glyphicon glyphicon-menu-right"></i> {{ ($setting['name'] != '') ? $setting['name'] : $setting['key'] }}
										</label>
										<div class="log-switch">
											<div class="onoffswitch">
												<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" data-setting-key="{{ $setting['key'] }}" id="{{ $setting['key'] }}_switch" {{ $setting['value'] ? 'checked' : '' }}>
												<label class="onoffswitch-label" for="{{ $setting['key'] }}_switch">
													<span class="onoffswitch-inner"></span>
													<span class="onoffswitch-switch"></span>
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						@endforeach
					@else
						There are no settings to configure.
					@endif
				</div>
			</div>

		</section>
	</div>

@endsection

@section('footer-script')
	<script src="{{ cdn(elixir('js/admin.js')) }}"></script>
@stop
