<?php
	$defaultDataPagination = [
		"page" => $campaigns->currentPage(),
		"view_name" => "campaign-processed-rows",
		"order_field" => "updated_at",
		"order_type" => "DESC"
	];
?>

<div class="table-responsive">
	<table width="100%" border="0" cellpadding="0" cellspacing="0" id="<?php echo $defaultDataPagination["view_name"]; ?>" class="table table-bordered table-striped sortable campaign-list" data-pagination='<?php echo json_encode($defaultDataPagination); ?>'>
		<thead>
			<tr>
				<th width="150" class="sortable">
					<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="sort_creation_datetime" data-order-field="created_at">
						Date Finished
						<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
					</a>
				</th>
				<th width="150" class="sortable">
					<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="sort_user_email" data-order-field="user_email">
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
				<th  width="300" class="bold" colspan="2">Actions</th>
			</tr>
		</thead>
		<tbody>
			@include('base.partials.dashboard.draw_processed_campaign_row')
			{{-- <tr>
				<td align="center" colspan="3"><h4>No results found.</h4></td>
			</tr> --}}
		</tbody>
	</table>	
</div>

{{-- Finished Emails Pagination --}}
@if( $campaigns->lastPage() > 1)
	@include('base.partials.dashboard.pagination', array(
		"pages" => $campaigns->lastPage(),
		"current" => $campaigns->currentPage(),
		"view" => $defaultDataPagination["view_name"]
	))
@endif