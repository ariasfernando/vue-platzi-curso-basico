<!-- generate  -->
@foreach ($menu_list as $item_name => $menu_item)
	@if ($item_name != "override")
		@if (isset($menu_item['sub_menu']))
			<div class="expand">
				<h2>{{ $menu_item['title'] }} <i class="glyphicon"></i></h2>
				<div class="{{ $menu_item['level'] }}">
					@include('base.partials.campaign.menu', array("menu_list"=>$menu_item['sub_menu']) )
				</div>
			</div>
		@else
			<div class="add single" id="{{ $menu_item['module_id'] }}" data-class="{{ $menu_item['class'] or '' }}" data-app-name="{{ $menu_item['app_name'] }}">
				<h2>{{ $menu_item['title'] }} <i class="glyphicon"></i></h2>
			</div>
		@endif
	@endif
@endforeach

