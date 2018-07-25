<header>
    <div class="container-fluid">
        <div class="row">
            {{-- Logo --}}
            <div class="col-xs-8 col-md-4 logoContainer">
                <div class="logo">
                    @if (!Auth::check() || Auth::user()->can('access_dashboard'))
                        <a href="{{ url('/') }}">
                    @else
                        <a>
                    @endif
                        <span class="brand-logo"></span>
                    </a>
                </div>
            </div>

            <div class="col-md-5">
                <h1 class="campaign-title">{{ $params['header_title'] }}</h1>
            </div>

            {{-- Navigation --}}
            <div class="col-xs-4 col-md-3 logButton pull-right">
                <nav>
                   
                    @if (!Auth::guest())

                        @if (config('support.enabled'))
                            <div class="dropdown" id="help-dropdown">
                                <a class="help dropdown-toggle help-dropdown-menu" type="button" data-toggle="dropdown" aria-expanded="false">
                                    <i class="glyphicon glyphicon-question-sign"></i>
                                    <span>Help Center</span>
                                    <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu">
                                    @foreach(config('support.sections') as $name => $section) 
                                    <li><a href="{{ rtrim(config('app.url'), '/') . '/support/' . $name }}" target="_blank">{{ $section['text']}}</a></li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                    @endif

                    @if (config('app.home.enabled') && (!Auth::check() || Auth::user()->can('access_dashboard')))
                        <a href="{{ url('/') }}" class="home">
                            <i class="glyphicon glyphicon-home"></i>
                            <span>Home</span>
                        </a>
                    @endif
                    @if (!Auth::guest())
                        <a href="{{ url('/auth/logout') }}" class="logout">
                            <i class="glyphicon glyphicon-log-out"></i>
                            <span>Logout</span>
                        </a>
                    @endif
                </nav>
            </div>
        </div>
    </div>
</header>
