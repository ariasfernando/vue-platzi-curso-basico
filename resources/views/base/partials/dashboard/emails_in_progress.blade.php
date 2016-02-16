<?php
	$defaultDataPagination = [
		"page" => $campaigns->currentPage(),
		"view_name" => "campaign-edited-rows",
		"order_field" => "updated_at",
		"order_type" => "DESC",
	];
?>

<div class="table-responsive">
	<table width="100%" border="0" cellpadding="0" cellspacing="0" id="<?php echo $defaultDataPagination["view_name"]; ?>" class="table table-bordered table-striped sortable campaign-list" data-pagination='<?php echo json_encode($defaultDataPagination); ?>'>
		<thead>
			<tr>
				<th width="150" class="sortable">
					<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="updated_at" data-order-field="updated_at">
						Date Started
						<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
					</a>
				</th>
				<th width="150" class="sortable">
					<a href="#" class="sortable-option" id="updated_at" data-order-field="updated_at">
						Last Modified
						<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
					</a>
				</th>
				<th width="150" class="sortable">
					<a href="#" class="sortable-option" id="user_email" data-order-field="user_email">
						Last Modified by
						<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
					</a>
				</th>
				<th class="sortable">
					<a href="#" class="sortable-option" id="campaign_name" data-order-field="campaign_name">
						Email Name
						<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
					</a>
				</th>
				<th  width="150" class="bold">Actions</th>
			</tr>
		</thead>
		<tbody>
			@include('base.partials.dashboard.draw_campaign_row')
		</tbody>
	</table>
</div>

{{-- Current Email in progress Pagination --}}
@if( $campaigns->lastPage() > 1)
	@include('base.partials.dashboard.pagination', array(
		"pages" => $campaigns->lastPage(),
		"current" => $campaigns->currentPage(),
		"view" => $defaultDataPagination["view_name"]
	))
@endif