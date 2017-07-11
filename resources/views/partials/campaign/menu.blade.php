<!-- generate  -->
@foreach ($menu_list as $item_name => $menu_item)
	@if ($item_name !== "override")
		@if (isset($menu_item['sub_menu']))
			<div class="expand">
				<h2>{{ $menu_item['name'] }} <i class="glyphicon"></i></h2>
				<div class="{{ $menu_item['level'] }}">
					@include('partials.campaign.menu', array("menu_list" => $menu_item['sub_menu']) )
				</div>
			</div>
		@else
                       @if($menu_item['module_id'] !== $params['campaign_data']->getLibraryConfig('fixed_footer'))
			<div class="add single" id="{{ $menu_item['key'] }}" data-params="{{ json_encode($menu_item) }}">
				<h2>{{ $menu_item['name'] }} <i class="glyphicon glyphicon-plus"></i></h2>
			</div>
                       @endif
		@endif
	@endif
@endforeach

