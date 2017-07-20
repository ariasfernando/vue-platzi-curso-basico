{{-- Default button --}}
@section('default_menu')
    <a class="btn btn-default" href="{{ URL::to( url('campaign/edit') . '?' . http_build_query([ 'locale' => 'en_us', "library" => "default" ])) }}">
        Create a new email
    </a>
@stop

{{-- If no configuration show default button --}}
@if (!isset($app_config) or !isset($app_config['view']) or !isset($app_config['view']['campaign_format']))
    @yield('default_menu')
@else
    {{-- Languages --}}
    @if ($app_config['view']['campaign_format'] === "languages")
        @if ( isset($app_config['locale']['langs']))
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
                Create a new email<span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                @foreach ($app_config['locale']['langs'] as $key => $value)
                    <li role="presentation">
                        <a href="{{ URL::to( url('campaign/edit') . '?' . http_build_query([ 'locale' => $key, "library" => "default" ])) }}">{{ $value['name'] }}</a>
                    </li>
                @endforeach
            </ul>
        @else
            @yield('default_menu')
        @endif

    {{-- Libraries --}}
    @elseif ($app_config['view']['campaign_format'] === "libraries")
        @if ( count($params['libraries']) === 0 )
            There is no library to create a new email
        @else
            @if( count($params['libraries']) === 1)
                <a class="btn btn-default" href="{{ URL::to( action('CampaignController@getEdit') . '?' . http_build_query([ 'locale' => 'en_us', "library" => $params['libraries'][0]['_id'] ])) }}">
                    Create a new email
                </a>
            @else
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">
                Create a new email<span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                @foreach ($params['libraries'] as $library)
                    <li role="presentation">
                        <a href="{{ URL::to( url('campaign/edit') . '?' . http_build_query([ 'locale' => 'en_us', "library" => $library['_id'] ])) }}">
                            {{ $library['name'] }}
                        </a>
                    </li>
                @endforeach
            </ul>
            @endif
        @endif
    @else
        @yield('default_menu')
    @endif
@endif
