
@extends('admin.layouts.studio')

@section('content')

	<router-view></router-view>

@endsection

@section('footer-script')
    <script src="{{ cdn( mix('js/admin.js') ) }}"></script>
	<script src="{{ cdn( mix('js/studio-module.js') ) }}"></script>
@stop
