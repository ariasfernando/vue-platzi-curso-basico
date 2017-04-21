<?php
	$defaultDataPagination = [
		"page" => $libraries->currentPage(),
		"view_name" => "admin-library",
		"order_field" => "updated_at",
		"order_type" => "DESC",
	];
?>

@extends('base.admin.layouts.studio')

@section('content')

	<div class="col-xs-12 admin-libraries-container" id="<?php echo $defaultDataPagination["view_name"]."-container"; ?>">
        <router-view :libraries="{{ htmlentities( json_encode($libraries), ENT_QUOTES, 'UTF-8' ) }}"></router-view>
	</div>

@endsection

@section('footer-script')
  <script src="{{ url( elixir('js/library-v2.js') ) }}"></script>
	<script src="{{ url( elixir('js/studio-library.js') ) }}"></script>
@stop