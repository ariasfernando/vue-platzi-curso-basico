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
    <script src="{{ cdn(mix('js/library.js')) }}"></script>
    <script src="{{ url(mix('js/proof.js')) }}"></script>
    <script src="{{ url(mix('js/vue-components.js')) }}"></script>
@stop
