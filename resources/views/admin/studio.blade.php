@extends('admin.layouts.studio')

@section('content')
	<section id="studio" class="container">
        <router-view></router-view>
    </section>
@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/studio-components.js') ) }}"></script>
@stop