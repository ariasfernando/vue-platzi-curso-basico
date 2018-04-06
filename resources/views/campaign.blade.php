@extends('layouts.master')

@section('content')

	<div id="campaign">
        <campaign
            campaign-id="{{ $params['campaign_id'] }}"
            library-id="{{ $params['library_id'] }}"
            cached-window-id="{{ $params['cached_window_id'] }}"
            window-id="{{ bin2hex(random_bytes(15)) }}">
        </campaign>
    </div>

@endsection

@section('footer-script')
    <script src="{{ cdn(mix('js/jquery.js')) }}"></script>
    <script src="{{ cdn(mix('js/bootstrap.js')) }}"></script>
    <script src="{{ cdn(mix('js/tinymce.js')) }}"></script>
    <script src="{{ cdn(mix('js/application-utils-v2.js')) }}"></script>
    <script src="{{ cdn(mix('js/campaign-components.js')) }}"></script>
@stop