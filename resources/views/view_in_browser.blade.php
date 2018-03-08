@extends('layouts.preview')
@section('content')

    <div class="col-xs-12">
        <div class="col-xs-12" id="public-view">
            <modal-preview ref="preview" :is-public="true"></modal-preview>
        </div>
    </div>

@endsection

@section('footer-script')
    <script src="{{ cdn(mix('js/customer.js')) }}"></script>
    <script src="{{ cdn(mix('js/jquery.js')) }}"></script>
    <script src="{{ cdn(mix('js/public-view.js')) }}"></script>
@stop
