@if ( ( ( Config::get('campaign.locking') && !$params['campaign_data']->template )
        || ( Config::get('campaign.locking_templates') && $params['campaign_data']->template ) )
    && ( !Config::has('campaign.libraries.' . $params['campaign_data']->library . '.locking')
        || Config::get('campaign.libraries.' . $params['campaign_data']->library . '.locking')))
    <div class="config-box-divider clearfix" id="locking" data-status="{{ ($params['campaign_data']->locked) ? 'locked' : 'unlocked' }}">
        <label class="locking"><span>{{ ($params['campaign_data']->locked) ? 'Unlock' : 'Lock' }}</span> <span  class="locking_type">{{ ($params['campaign_data']->template) ? 'Template' : 'Campaign' }}</span></label>
            <button
                class="lock-campaign-btn btn btn-default {{($params['campaign_data']->locked) ? 'hidden' : '' }}"
                data-toogle="tooltip"
                data-placement="botom"
                title="Campaign is unlocked"
            >
                <i class="fa fa-unlock" aria-hidden="true"></i>
            </button>
            <button
                class="unlock-campaign-btn btn btn-default {{($params['campaign_data']->locked ) ? '' : 'hidden'}}"
                @if(Auth::user()->email !== $params['campaign_data']->locked_by)
                        disabled="disabled"
                @endif
                data-toogle="tooltip"
                data-placement="bottom"
                title="Campaign is locked"
            >
                <i class="fa fa-lock" aria-hidden="true"></i>
            </button>
    </div>
@endif
