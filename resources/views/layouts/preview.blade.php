<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Email Preview</title>

        <link href="{{ url(mix('css/tool.css')) }}" rel="stylesheet">
    </head>
    <body>

        {{-- CONTENT --}}
        <div class="container">

            <div class="row">
                {{-- Content --}}
                @yield('content')
            </div>

        </div>

        @section('master-application-scripts')
            {{-- Global Application JS object --}}
            @include('partials.application_script')
        @show
        @section('footer-script')

        @show

    </body>
</html>