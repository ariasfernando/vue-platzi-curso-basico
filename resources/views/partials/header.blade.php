<header>
    <div class="container-fluid">
        <div class="row">
            {{-- Logo --}}
            <div class="col-xs-8 col-md-6 logoContainer">
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

            {{-- Navigation --}}
            <div class="col-xs-4 col-md-6 logButton pull-right">
                <nav>
                    @if (config('app.help.enabled'))
                        <a href="{{ url(config('app.help.url')) }}" class="help" target="_blank">
                            <i class="glyphicon glyphicon-question-sign"></i>
                            <span>Help Center</span>
                        </a>
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
