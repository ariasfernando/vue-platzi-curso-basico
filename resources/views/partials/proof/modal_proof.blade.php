@if (config('proof.status'))
	<div id="modal-send-proof" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-md">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span></button>
					<h4>Who would you like to send this email to for review?</h4>
				</div>

				@include('partials.proof.modal_proof_table')

				<div class="modal-footer">
					<button type="button" class="btn btn-primary btn-cancel" data-dismiss="modal">Cancel</button>
					<button class="btn btn-default" id="btn-send-proof">Submit</button>
				</div>

			</div>
		</div>
	</div>

	<div id="modal-track-proof" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-md">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span></button>
					<h1>Tracking</h1>
					<h4>Campaign: <span class="proof-campaign-name"></span></h4>
				</div>

				<div class="modal-body">
					<div class="track-proof">
						<input type="hidden" name="campaign_id" value="">
						<input type="hidden" name="proof_token" value="">
						<table class="table table-condensed" id="track-table">
							<thead>
								<tr>
									<th class='col-xs-5'>Email</th>
									<th class='col-xs-3'>Status</th>
									<th class='col-xs-3'>Last modified date</th>
									<th class='col-xs-1'></th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>

				</div>

			</div>
		</div>
	</div>

	@include('partials.proof.modal_list_comments')
@endif
