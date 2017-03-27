@extends('base.admin.layouts.studio')

@section('content')

	<div class="col-xs-12" id="studio">
	    <studio :modules="{{ htmlentities( json_encode($modules), ENT_QUOTES, 'UTF-8' ) }}" :libraries="{{ htmlentities( json_encode($libraries), ENT_QUOTES, 'UTF-8' ) }}"></studio>
	</div>

@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/studio-components.js') ) }}"></script>
@stop