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
			@if (config('campaign.enable_tagging'))
				<div class="config-box-divider">
					<input name="tag_entry" type="text" placeholder="Add Tag" maxlength="30" data-autocomplete='<?php echo htmlentities( json_encode(Tag::getTagNames()), ENT_QUOTES, 'UTF-8' ); ?>'/>
					<div id="tags-box" class="clearfix">
						@if (!is_null($params['campaign_data']->tags))
							@foreach($params['campaign_data']->tags as $tag)
								<span class="st-tag">
									{{$tag}}
									<span class="remove-tag" data-tag="{{$tag}}"><i class="fa fa-times"></i></span>
								</span>
							@endforeach
						@endif
					</div>
				</div>
			@endif
			{{-- Hidden Inputs --}}
			<input type="hidden" name="campaign_id" id="campaign_id" value="{{ $params['campaign_id'] }}">
			<input type="hidden" name="campaign_process" id="campaign_process" value="{{ $params['campaign_data']->processed}}">
			<input
				type="hidden"
				name="tags"
				id="campaign-tags"
				value="{{ (!is_null($params['campaign_data']->tags))? json_encode($params['campaign_data']->tags) : "[]" }}">
		</form>
	</div>
</div>
