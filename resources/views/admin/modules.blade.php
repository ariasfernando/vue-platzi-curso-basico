
@extends('admin.layouts.studio')

@section('content')

	<div class="col-xs-12" id="admin-module-container">
		<router-view></router-view>
	</div>

@endsection

@section('footer-script')
    <script src="{{ cdn( elixir('js/admin.js') ) }}"></script>
	<script src="{{ cdn( elixir('js/studio-module.js') ) }}"></script>
@stop