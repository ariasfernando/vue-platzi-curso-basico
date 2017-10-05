<?php
    $main_class = explode('.', $view_name);
    $main_class = "base-" . end($main_class) . " " . str_replace('.', '-', $view_name);
    $lock_error_hidden_class = 'hidden';
    if (session()->has('campaign_lock')) {
        $lock_error_hidden_class = '';
    }
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Email Creator</title>

        <link href="{{  cdn(elixir('css/tool.css')) }}" rel="stylesheet">

        @section('master-head')
            {{--  --}}
        @show

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="<?php echo $main_class; ?>">

        @section('master-body')
            {{--  --}}
        @show

        @section('master-metrics')
            @include('partials.metrics')
        @show

        {{-- HEADER --}}
        @section('header')
            @include('partials.header')
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
                                    @if(config('campaign.show_who_is_locking'))
                                    [ {{ Campaign::whoIsLocking(session()->get('campaign_lock')) }} ]
                                    @endif
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
                @elseif( session()->has('campaign_permission') )
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="global-messages-placeholder text-center">
                                <div class="alert alert-warning" role="alert">
                                    You are not allowed to open this campaign.
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
                        <i class="fa fa-angle-double-up" title="Back to Top"></i>
                    </a>
                </span>
            @endif
        </div>

        @section('master-modals')
            {{-- Modal spinner --}}
            @include('partials.modal_spinner')
            {{-- Modal Confirm --}}
            @include('partials.modal_confirm')
        @show

        @section('master-api-modals')
            {{-- Modal Upload --}}
            @foreach (Helper::getApiDrivers() as $api)
                @include('partials.campaign.modal_campaign_'.$api.'_upload')
            @endforeach
        @show

        @section('master-debug')
            {{-- Debug --}}
            @include('layouts.partials.debug')
        @show

        {{-- Scripts --}}
        <script src="{{ cdn(elixir('js/customer.js')) }}"></script>

        @section('master-application-scripts')
            {{-- Global Application JS object --}}
            @include('partials.application_script')
        @show

        @section('footer-script')

        @show

    </body>
</html>
