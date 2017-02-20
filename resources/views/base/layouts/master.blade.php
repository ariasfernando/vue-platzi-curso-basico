<?php $main_class = str_replace('.','-', str_replace( explode('.',$view_name)[0], "base", $view_name ) ). " " . str_replace('.','-', $view_name); ?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Email Creator</title>

        <link href="{{  url( elixir('css/base.css') ) }}" rel="stylesheet">

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="<?php echo $main_class; ?>">

        @include('base.partials.metrics')

        {{-- HEADER --}}
        @section('header')
            @include('base/partials/header')
        @show

        {{-- CONTENT --}}
        <div class="container">
            {{-- Error Place holder --}}
            @section('error-placeholder')
                @if( session()->has('campaign_lock') )
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="global-messages-placeholder text-center">
                                <div class="alert alert-warning" role="alert">
                                    <strong>Warning!</strong> Another user is editing this campaign
                                </div>
                            </div>
                        </div>
                    </div>
                @elseif( session()->has('campaign_not_found') )
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="global-messages-placeholder text-center">
                                <div class="alert alert-warning" role="alert">
                                    Sorry, we couldn't find the requested campaign
                                </div>
                            </div>
                        </div>
                    </div>
                @else
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="global-messages-placeholder text-center display-none">
                                <div class="alert alert-danger" role="alert">
                                    <strong></strong>
                                </div>
                            </div>
                        </div>
                    </div>
                @endif
            @show

            <div class="row">
                {{-- Content --}}
                @yield('content')
            </div>

            @if ($current_user)
                <span id="top-link-block" class="hidden">
                    <a href="#top" class="well well-sm" onclick="$('html,body').animate({scrollTop:0},'slow');return false;">
                        <i class="glyphicon glyphicon-chevron-up"></i> Back to Top
                    </a>
                </span>
            @endif
        </div>

        {{-- Modal spinner --}}
        @include('base/partials/modal_spinner')
        {{-- Modal Confirm --}}
        @include('base/partials/modal_confirm')

        {{-- Modal Upload --}}
        @foreach (Helper::getApiDrivers() as $api)
            @include('base.partials.campaign.modal_campaign_'.$api.'_upload')
        @endforeach

        {{-- Debug --}}
        @include('base/layouts/partials/debug')
        {{-- Scripts --}}
        <script src="{{ url( elixir('js/library.js') ) }}"></script>

        {{-- Global Application JS object --}}
        @include('base/partials/application_script')

        @section('footer-script')

        @show

    </body>
</html>
