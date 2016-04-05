<header>
    <div class="container">
        <div class="row">
            <!-- Logo -->
            <div class="col-xs-8 col-md-6">
                <div class="logo">
                    <a href="{{ url('/') }}">
                        <span class="brand-logo"></span>
                        <span class="by-stensul"></span>
                    </a>
                </div>
            </div>

            <!-- Navigation -->
            <div class="col-xs-4 col-md-6">
                <nav>
                    @if (!Auth::guest())
                        <a href="{{ url('/auth/logout') }}" class="logout">
                            <i class="glyphicon glyphicon-off"></i>
                            <span>Logout</span>
                        </a>
                    @endif
                </nav>
            </div>
        </div>
    </div>
</header>