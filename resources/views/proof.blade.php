@extends('layouts.master')

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
    <script src="{{ url( elixir('js/proof.js') ) }}"></script>
    <script src="{{ url( elixir('js/vue-components.js') ) }}"></script>
@stop
