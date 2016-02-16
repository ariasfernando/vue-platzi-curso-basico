<header>
	<div class="container">
		<div class="row">
			<!-- Logo -->
			<div class="col-xs-8 col-md-6 logoContainer">
				<div class="logo">
					<a href="{{ url('/') }}">
						<span class="brand-logo"></span>
						<span class="by-stensul"></span>
					</a>
				</div>
			</div>

			<!-- Navigation -->
			<div class="col-xs-4 col-md-6 logButton">
				<nav>
					@if (!Auth::guest())
						<span>{{ Auth::user()->name }}</span>
						<a href="{{ url('admin/logout') }}" class="logout">
							<i class="glyphicon glyphicon-off"></i>
							<span>Logout</span>
						</a>
					@endif
				</nav>
			</div>
		</div>
	</div>
</header>