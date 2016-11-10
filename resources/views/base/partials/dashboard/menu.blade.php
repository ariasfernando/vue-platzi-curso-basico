{{-- Default button --}}
@section('default_menu')
    <a class="btn btn-default" href="{{ URL::to( action('CampaignController@getEdit') . '?' . http_build_query([ 'locale' => 'en_us', "library" => "default" ])) }}">
        Create a new email
    </a>
@stop

{{-- If no configuration show default button --}}
@if (!isset($app_config) or !isset($app_config['view']) or !isset($app_config['view']['campaign_format']))
    @yield('default_menu')
@else
    {{-- Languages --}}
    @if ($app_config['view']['campaign_format'] === "languages")
        @if ( isset($app_config['locales']))
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
                Create a new email<span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                @foreach ($app_config['locales'] as $key => $value)
                    <li role="presentation">
                        <a href="{{ URL::to( action('CampaignController@getEdit') . '?' . http_build_query([ 'locale' => $key, "library" => "default" ])) }}">{{ $value }}</a>
                    </li>
                @endforeach
            </ul>
        @else
            @yield('default_menu')
        @endif

    {{-- Libraries --}}
    @elseif ($app_config['view']['campaign_format'] === "libraries")
        @if ( !isset($app_config['view']['libraries']) and count($app_config['view']['libraries']) === 0 )
            @yield('default_menu')
        @else
           @if ( count($current_user->getLibraries()) === 0 )
               @yield('default_menu')
           @else

                {{-- Show library by auth groups --}}
                @if( count($app_config['view']['libraries']) > 0)
                    @if( count($current_user->getLibraries()) === 1)
                        <a class="btn btn-default" href="{{ URL::to( action('CampaignController@getEdit') . '?' . http_build_query([ 'locale' => 'en_us', "library" => $current_user->getLibraries()[0] ])) }}">
                            Create a new email
                        </a>
                    @else
                        <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
                            Create a new email<span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                            @foreach ($app_config['view']['libraries'] as $library_key => $library_value)
                                 @if( $current_user->see($library_key) )
                                    <li role="presentation">
                                        <a href="{{ URL::to( action('CampaignController@getEdit') . '?' . http_build_query([ 'locale' => 'en_us', "library" => $library_key ])) }}">
                                            {{ $app_config['view']['libraries'][$library_key]["title"] }}
                                        </a>
                                    </li>
                                 @endif
                            @endforeach
                        </ul>
                    @endif
                @else
                    @yield('default_menu')
                @endif

           @endif
        @endif
    @else
        @yield('default_menu')
    @endif
@endif