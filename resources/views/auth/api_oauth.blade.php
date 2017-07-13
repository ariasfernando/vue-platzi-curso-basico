{{-- Extend master layout --}}
@extends('layouts.master')

{{-- For an empty header --}}
@section('header')
@stop

{{-- Content --}}
@section('content')

    <script type="text/javascript">
        var data = {!! $data !!};
        window.opener.Application.api().oauthCallback(data);
        self.close();
    </script>

@endsection
