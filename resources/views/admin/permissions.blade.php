<?php
	$defaultDataPagination = [
		"page" => $permissions->currentPage(),
		"view_name" => "admin-permission",
		"order_field" => "updated_at",
		"order_type" => "DESC",
	];
?>

@extends('admin.layouts.master')

@section('content')

	<div class="col-xs-12" id="<?php echo $defaultDataPagination["view_name"]."-container"; ?>">
		<section class="col-xs-12 section-container">

			<div class="row">
				<div class="col-xs-12">
					<h2 class="pull-left">Permission List</h2>
					<div class="btn btn-default btn-create pull-right">
						<i class="glyphicon glyphicon-plus-sign"></i> Create a new permission
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12">

					<div class="table-responsive">
						<table width="100%" border="0" cellpadding="0" cellspacing="0" id="<?php echo $defaultDataPagination["view_name"]; ?>" class="table table-bordered table-striped sortable data-list" data-pagination='<?php echo json_encode($defaultDataPagination); ?>'>
							<thead>
								<tr>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="name" data-order-field="name">
											Name
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="email" data-order-field="description">
											Description
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th width="150">
										<a href="#" class="" id="group">
											Roles
										</a>
									</th>
									<th width="150" class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="created_at">
											Create Date
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th  width="150" class="bold">Actions</th>
								</tr>
							</thead>
							<tbody>
								@include('admin.partials.permission_draw_row')
							</tbody>
						</table>
					</div>

					@if( $permissions->lastPage() > 1 && count($permissions->lastPage()) )
						<div class="pagination" data-pages="<?php echo $permissions->lastPage(); ?>" <?php echo (isset($defaultDataPagination["view_name"]))? 'data-view="'.$defaultDataPagination["view_name"].'"':''; ?>></div>
					@endif
				</div>
			</div>

		</section>
	</div>

@endsection

@section('footer-script')
	<script src="{{ cdn(mix('js/admin.js')) }}"></script>
@stop
