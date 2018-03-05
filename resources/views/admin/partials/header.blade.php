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
						<a href="{{ url('admin/logout') }}" class="logout">
							<i class="glyphicon glyphicon-log-out"></i>
							<span>Logout</span>
						</a>
					@endif
				</nav>
			</div>
		</div>
	</div>
</header>
