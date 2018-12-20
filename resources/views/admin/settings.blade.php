
@extends('admin.layouts.studio')

@section('content')

	<div class="col-xs-12" id="admin-settings-container">
		<router-view></router-view>
	</div>

@endsection

@section('footer-script')
    <script src="{{ cdn( mix('js/admin.js') ) }}"></script>
    <script src="{{ cdn( mix('js/global-settings.js') ) }}"></script>
@stop