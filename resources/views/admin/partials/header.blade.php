<header>
	<div class="container-fluid">
		<div class="row">
			<!-- Logo -->
			<div class="col-xs-8 col-md-6 logoContainer">
				<div class="logo">
					<a href="{{ url('/admin') }}">
						<span class="brand-logo"></span>
					</a>
				</div>
			</div>

			<!-- Navigation -->
			<div class="col-xs-4 col-md-6 logButton pull-right">
				<nav>
					@if (!Auth::guest())
						<span>{{ Auth::user()->name }}</span>
						@if (!Auth::check() || Auth::user()->can('access_dashboard'))
							<a href="{{ url('/') }}" class="help dropdown-toggle help-dropdown-menu">
								<i class="glyphicon glyphicon-dashboard"></i>
								<span>Dashboard</span>
							</a>
						@endif
						<a href="{{ url('admin/logout') }}" class="logout">
							<i class="fa fa-sign-out"></i>
							<span>Logout</span>
						</a>
					@endif
				</nav>
			</div>
		</div>
	</div>
</header>
