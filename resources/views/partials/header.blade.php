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
                    @if (!Auth::guest())

                        @if (config('support.enabled'))
                            <div class="dropdown" id="help-dropdown">
                                <a class="help dropdown-toggle help-dropdown-menu" type="button" data-toggle="dropdown" aria-expanded="false">
                                    <i class="fa fa-question-circle"></i>
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
                            <i class="fa fa-home"></i>
                            <span>Home</span>
                        </a>
                    @endif
                    @if (!Auth::guest())
                        <a href="{{ url('/auth/logout') }}" class="logout">
                            <i class="fa fa-sign-out"></i>
                            <span>Logout</span>
                        </a>
                    @endif
                </nav>
            </div>
        </div>
    </div>
</header>
