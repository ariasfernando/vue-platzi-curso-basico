<?php
	$defaultDataPagination = [
		"page" => $logs->currentPage(),
		"view_name" => "admin-log",
		"order_field" => "updated_at",
		"order_type" => "DESC",
	];
?>

@extends('admin.layouts.master')

@section('content')

	<div class="col-xs-12" id="<?php echo $defaultDataPagination["view_name"]."-container"; ?>" data-search="{{json_encode($search_query)}}">
		<section class="col-xs-12 section-container">
			<div class="row">
				<div class="col-xs-12">
					<h2 class="pull-left">Log List</h2>
					<div class="list-action-container log-action-container pull-right">
						<div class="admin-log-tail">
							<div class="log-switch">
								<div class="onoffswitch">
									<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
									<label class="onoffswitch-label" for="myonoffswitch">
										<span class="onoffswitch-inner"></span>
										<span class="onoffswitch-switch"></span>
									</label>
								</div>
							</div>
							<label for="onoffswitch" class="clear-label">Auto refresh</label>
						</div>
					</div>
					<div class="pull-right admin-search-box">

						{!! Form::open ( array ( 'method' => 'get' ,'id' => 'admin-log-search', 'url' => url('/').'/admin/log' )) !!}

							{!! Form::text('q', (count($search_query))? $search_query['q'] : '', array (
								'class' => 'search_field',
								'id' => 'search_field'
							)) !!}

							{!! Form::submit('&#xe003;', array ( 'class' => 'btn btn-success pull-right submit-config glyphicon glyphicon-search')) !!}

						{!! Form::close() !!}

						<button class="btn btn-success" id="admin-clear-btn">
							<i class="glyphicon glyphicon-remove-sign"></i>
						</button>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">

					<div class="table-responsive">
						<table width="100%" border="0" cellpadding="0" cellspacing="0" id="<?php echo $defaultDataPagination["view_name"]; ?>" class="table table-bordered table-striped sortable data-list" data-pagination='<?php echo json_encode($defaultDataPagination); ?>'>
							<thead>
								<tr>
									<th class="sortable col-200">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="name" data-order-field="_id">
											Log Id
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable col-200">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="properties.user_id">
											User Id
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="campaign_id">
											Campaign Id
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="email" data-order-field="description">
											Description
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable col-100">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="group" data-order-field="ip">
											User IP
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable col-200">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="group" data-order-field="user_agent">
											User Agent
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable col-200">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="controller">
											Controller/Action
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="created_at">
											Create Date
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
								</tr>
							</thead>
							<tbody>
								@include('admin.partials.logs_draw_row')
							</tbody>
						</table>
					</div>


					@if( $logs->lastPage() > 1 && count($logs->lastPage()) )
						<div class="pagination" data-pages="<?php echo $logs->lastPage(); ?>" <?php echo (isset($defaultDataPagination["view_name"]))? 'data-view="'.$defaultDataPagination["view_name"].'"':''; ?>></div>
					@endif
				</div>
			</div>

		</section>
	</div>

@endsection

@section('footer-script')
	<script src="{{ cdn(elixir('js/admin.js')) }}"></script>
@stop
