<div class="modal-body">
	<h4>Who would you like to send this email to for review?</h4>
	<div class="send-proof">
		<form name="send-proof-form" id="send-proof-form" action="">
			<input type="hidden" name="campaign_id" value="">
			<input type="hidden" name="proof_id" value="">
			<div class="form-group">
				<div class="input-group">
					{!!
						Form::select('proof_users', $proof_users, null, [
							'data-live-search' => 'true',
							'class' => 'proof-users-picker form-control'
						])
					!!}
					<span class="input-group-btn">
						<button type="button" class="btn btn-default btn-reviewer-add beta-btn-primary">Add</button>
					</span>
				</div>
			</div>
			<table class="table table-condensed" id="reviewers-table">
				<thead>
					<tr>
						<th class='col-xs-5'>Email</th>
						<th class='col-xs-2'>Required approval</th>
						<th class='col-xs-1'>Actions</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			<div class="checkbox new-proof-checkbox">
				<div class="input-group">
					<label data-toggle="tooltip" data-placement="top"
						title="Existing comments, approvals, and rejections will be archived.">
						<input type="checkbox" value="1" name="create_new_proof"> Start proof from scratch
					</label>
				</div>
				<div class="input-group">
					<label>
						<input type="checkbox" value="1" name="send_to_all"> Send a notifications to all reviewers
					</label>
				</div>
			</div>
		</form>
	</div>

	@include('partials.proof.modal_add_message')
</div>
