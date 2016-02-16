<div class="expand configuration-mod">
	<h2>Campaign Configuration<i class="glyphicon icon-open-expan"></i></h2>
	<div class="level-1 open-section-campaign">
		<form class="campaign-configuration" name="campaign-configuration" id="campaignConfiguration">
			{{-- Configuration Inputs --}}
			<div>
				<label>Campaign Name:</label>
				<input name="campaign_name" type="text"
					value="{{ ($params['title'] != 'Untitled Campaign')? $params['title']:'' }}"
					placeholder="Untitled Campaign"
					data-validation='{"required":"true"}'/>
			</div>

			{{-- Hidden Inputs --}}
			<input type="hidden" name="campaign_id" id="campaign_id" value="{{ $params['campaign_id'] }}">
			<input type="hidden" name="campaign_process" id="campaign_process" value="{{ $params['campaign_data']->processed}}">
		</form>
	</div>
</div>