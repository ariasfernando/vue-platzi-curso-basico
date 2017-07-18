<?php
	$defaultDataPagination = [
		"page" => $libraries->currentPage(),
		"view_name" => "admin-library",
		"order_field" => "updated_at",
		"order_type" => "DESC",
	];
?>

@extends('admin.layouts.studio')

@section('content')

	<div class="col-xs-12 admin-libraries-container" id="<?php echo $defaultDataPagination["view_name"]."-container"; ?>">
        <router-view></router-view>
	</div>

@endsection

@section('footer-script')
    <script src="{{ cdn( elixir('js/library-v2.js') ) }}"></script>
    <script src="{{ cdn( elixir('js/admin.js') ) }}"></script>
    <script src="{{ cdn( elixir('js/studio-library.js') ) }}"></script>
@stop