
@extends('base.admin.layouts.studio')

@section('content')

	<div class="col-xs-12" id="admin-module-container">
		<router-view :modules="{{ htmlentities( json_encode($modules), ENT_QUOTES, 'UTF-8' ) }}"></router-view>
	</div>

@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/studio-module.js') ) }}"></script>
@stop