<?php $sections = config('admin.sections'); ?>
<aside id="admin-sidebar">
	<ul>
	@foreach ($sections as $section)
		@if (!isset($section['permission']) || Auth::user()->can($section['permission']))
			<li>
			@if(isset($section['action']))
				<a href="{{ action($section['action']) }}">
			@elseif(isset($section['children']))
				<a href="" class="beta-accordion-trigger">
			@else
				<a href="">
			@endif
					<span>
					@if(isset($section['icon']))
						<i class="glyphicon glyphicon-{{ $section['icon'] }}">
					@else
						<i class="glyphicon glyphicon-">
					@endif
							</i> {{ ucfirst($section['title']) }}
					</span>
				</a>
			@if(isset($section['children']))
				<i class="glyphicon glyphicon-menu-down pull-right menu-dropdown"></i>
				<ul class="beta-menu-dropdown">
				@foreach($section['children'] as $link)
					@if (!isset($link['permission']) || Auth::user()->can($link['permission']))
						<li>
						@if(isset($link['action']))
							<a href="{{ action($link['action']) }}">
						@else
							<a href="">
						@endif
								<span>
									@if(isset($link['icon']))
										<i class="glyphicon glyphicon-{{ $link['icon'] }}">
									@else
										<i class="glyphicon glyphicon-">
									@endif
										</i> {{ ucfirst($link['title']) }}
								</span>
							</a>
						</li>
					@endif
				@endforeach
				</ul>
			@endif
			</li>
		@endif
	@endforeach
	</ul>
</aside>