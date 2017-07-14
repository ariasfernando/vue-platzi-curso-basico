<aside id="admin-sidebar">
	<ul>
		<li>
			<a href="" class="beta-accordion-trigger">
				<span>
					<i class="glyphicon glyphicon-user"></i> Users
				</span>
			</a>
			<i class="glyphicon glyphicon-menu-down pull-right menu-dropdown"></i>
			<ul class="beta-menu-dropdown">
				<li>
					<a href="{{ url('admin/user') }}">
						<span>
							<i class="glyphicon glyphicon-list"></i> List
						</span>
					</a>
				</li>
				<li>
					<a href="{{ url('admin/role') }}">
						<span>
							<i class="glyphicon glyphicon-cog"></i> Roles
						</span>
					</a>
				</li>
				<li>
					<a href="{{ url('admin/permission') }}">
						<span>
							<i class="glyphicon glyphicon-lock"></i> Permissions
						</span>
					</a>
				</li>
			</ul>
		</li>
		<li>
			<a href="" class="beta-accordion-trigger">
				<span>
					<i class="glyphicon glyphicon-th-large"></i> Studio
				</span>
			</a>
			<i class="glyphicon glyphicon-menu-down pull-right menu-dropdown"></i>
			<ul class="beta-menu-dropdown">
				<li>
					<a href="{{ url('admin/library') }}">
						<span>
							<i class="glyphicon glyphicon-folder-open"></i> Libraries
						</span>
					</a>
				</li>
				<li>
					<a href="{{ url('admin/module') }}">
						<span>
							<i class="glyphicon glyphicon-th-list"></i> Modules
						</span>
					</a>
				</li>
			</ul>
		</li>
		<li>
			<a href="{{ url('admin/log') }}">
				<span>
					<i class="glyphicon glyphicon-menu-hamburger"></i> Logs
				</span>
			</a>
		</li>
	</ul>
</aside>