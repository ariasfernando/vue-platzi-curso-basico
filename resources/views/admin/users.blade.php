<?php
	$defaultDataPagination = [
		"page" => $users->currentPage(),
		"view_name" => "admin-user",
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
					<h2 class="pull-left">User List</h2>
					<div class="admin-search-box pull-right">
						{!! Form::open ( array ( 'method' => 'get' ,'id' => 'admin-user-search', 'url' => url('/') .'/admin/user' )) !!}

							{!! Form::text('q', (count($search_query))? $search_query['q'] : '', array (
								'class' => 'search_field',
								'id' => 'search_field'
							)) !!}

							{!! Form::submit('&#xe003;', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}

						{!! Form::close() !!}

						<button class="btn btn-success" id="admin-clear-btn">
							<i class="glyphicon glyphicon-remove-sign"></i>
						</button>
					</div>
					<div class="btn btn-default btn-create pull-right">
						<i class="glyphicon glyphicon-plus-sign"></i> Create a new user
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12">

					<div class="table-responsive">
						<table width="100%" border="0" cellpadding="0" cellspacing="0" id="<?php echo $defaultDataPagination["view_name"]; ?>" class="table table-bordered table-striped sortable data-list" data-pagination='<?php echo json_encode($defaultDataPagination); ?>'>
							<thead>
								<tr>
									<th width="150" class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="created_at" data-order-field="created_at">
											Create Date
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="name" data-order-field="name">
											Name
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="email" data-order-field="email">
											Email Name
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th width="150" class="sortable">
										<a href="#" class="sortable-option sort-order-<?php echo strtolower($defaultDataPagination['order_type']); ?>" id="group" data-order-field="group">
											User Role
											<i class="glyphicon glyphicon-menu-down pull-right"></i>
										</a>
									</th>
									<th  width="150" class="bold">Actions</th>
								</tr>
							</thead>
							<tbody>
								@include('admin.partials.user_draw_row')
							</tbody>
						</table>
					</div>
					@if ($users->lastPage() > 1)
						<div class="pagination" data-pages="<?php echo $users->lastPage(); ?>"
                            <?php echo isset($defaultDataPagination["view_name"])
                                ? 'data-view="' . $defaultDataPagination["view_name"] . '"' : ''; ?>>
                        </div>
					@endif
				</div>
			</div>

		</section>
	</div>

@endsection

@section('footer-script')
	<script src="{{ cdn(mix('js/admin.js')) }}"></script>
@stop
