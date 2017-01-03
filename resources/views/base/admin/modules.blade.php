
@extends('base.admin.layouts.master')

@section('content')

	<div class="col-xs-12" id="admin-module-container">
		<section class="col-xs-12 section-container">

			<div class="row">
				<div class="col-xs-12">
					<div class="btn btn-default btn-create">
						Create a new module
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12">
					<h2 class="crimson italic">Modules list</h2>

					<div class="table-responsive">
						<table width="100%" border="0" cellpadding="0" cellspacing="0" id="" class="table table-bordered table-striped">
							<thead>
								<tr>
									<th class="sortable">
										<a href="#" class="" id="module_id" data-order-field="module_id">
											_id
											<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
										</a>
									</th>
									<th class="sortable">
										<a href="#" class="" id="name" data-order-field="name">
											Name
											<i class="glyphicon glyphicon-triangle-bottom pull-right"></i>
										</a>
									</th>
									<th  width="150" class="bold">Actions</th>
								</tr>
							</thead>
							<tbody>
								@include('base.admin.partials.module_draw_row')
							</tbody>
						</table>
					</div>


				</div>
			</div>

		</section>
	</div>

@endsection

@section('footer-script')
	<script src="{{ url( elixir('js/admin.js') ) }}"></script>
@stop