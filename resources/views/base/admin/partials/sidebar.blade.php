<aside id="admin-sidebar">
	<ul>
		@foreach ( $app_config['admin']['sections'] as $section )
			<a href="{{ url('admin/'.$section['path']) }}" target="_self" title="{{ $section['title'] }}" alt="{{ $section['title'] }}">
				<li class="{{ str_contains($view_name, $section['path']) ? 'active' : '' }}">
					<span>{{ $section['title'] }}</span>
				</li>
			</a>
		@endforeach
	</ul>
</aside>