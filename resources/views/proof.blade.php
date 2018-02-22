@extends('layouts.master')

@section('header')
    @include('partials.proof.header')
@endsection

@section('content')

    <div class="col-xs-12" id="proof">

        <proof-viewer
            :token="'{{ $params['token'] }}'"
        ></proof-viewer>

    </div>

    {{-- VUE TEMPLATES --}}
    @include('partials.vue_templates')

@endsection

@section('footer-script')
    <script src="{{ cdn(elixir('js/library.js')) }}"></script>
    <script src="{{ url( elixir('js/proof.js') ) }}"></script>
    <script src="{{ url( elixir('js/vue-components.js') ) }}"></script>
@stop
