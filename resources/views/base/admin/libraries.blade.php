<?php
	$defaultDataPagination = [
		"page" => $libraries->currentPage(),
		"view_name" => "admin-library",
		"order_field" => "updated_at",
		"order_type" => "DESC",
	];
?>

@extends('base.admin.layouts.master')

@section('content')

	<div class="col-xs-12" id="<?php echo $defaultDataPagination["view_name"]."-container"; ?>">
		<section class="col-xs-12 section-container">

			<div class="row">
				<div class="col-xs-12">
					<div class="btn btn-default btn-create">
						Create a new library
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12">
					<h2 class="crimson italic">Libraries list</h2>

					<div class="table-responsive">
						<table width="100%" border="0" cellpadding="0" cellspacing="0" id="<?php echo $defaultDataPagination["view_name"]; ?>" class="table table-bordered table-striped sortable data-list" data-pagination='<?php echo json_encode($defaultDataPagination); ?>'>
							<thead>
								<tr>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="name" data-order-field="name">
											Name
											<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="email" data-order-field="description">
											Description
											<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
										</a>
									</th>
									<th width="150" class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="modules">
											Modules
											<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
										</a>
									</th>
									<th width="150" class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="created_at">
											Create Date
											<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
										</a>
									</th>
									<th  width="150" class="bold">Actions</th>
								</tr>
							</thead>
							<tbody>
								@include('base.admin.partials.library_draw_row')
							</tbody>
						</table>
					</div>

					@if( $libraries->lastPage() > 1 && count($libraries->lastPage()) )
						<div class="pagination" data-pages="<?php echo $libraries->lastPage(); ?>" <?php echo (isset($defaultDataPagination["view_name"]))? 'data-view="'.$defaultDataPagination["view_name"].'"':''; ?>></div>
					@endif
				</div>
			</div>

		</section>
	</div>

@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/admin.js') ) }}"></script>
@stop