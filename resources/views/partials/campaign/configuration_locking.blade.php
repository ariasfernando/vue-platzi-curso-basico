@if (!$params['campaign_data']->template
        && Config::get('campaign.locking')
        && (!Config::has('campaign.libraries.' . $params['campaign_data']->library . '.locking')
            || Config::get('campaign.libraries.' . $params['campaign_data']->library . '.locking')))
    <div class="config-box-divider clearfix" id="locking">
        <label class="locking"><span>{{ ($params['campaign_data']->locked) ? 'Unlock' : 'Lock' }}</span> Campaign:</label>
        <button
            class="lock-campaign-btn btn btn-default {{($params['campaign_data']->locked) ? 'hidden' : '' }}"
            data-toogle="tooltip"
            data-placement="botom"
            title="Lock campaign">
            <i class="fa fa-lock" aria-hidden="true"></i>
        </button>
        <button
            class="unlock-campaign-btn btn btn-default {{($params['campaign_data']->locked ) ? '' : 'hidden'}}"
            @if(Auth::user()->email !== $params['campaign_data']->locked_by)
                    disabled="disabled"
            @endif
            data-toogle="tooltip"
            data-placement="bottom"
            title="Unlock campaign">
            <i class="fa fa-unlock" aria-hidden="true"></i>
        </button>
    </div>
@endif