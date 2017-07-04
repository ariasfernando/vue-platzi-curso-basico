<div id="modal-campaign-processed" class="modal modal display-code-modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4>Normal HTML</h4>
            </div>
            <div class="modal-body">
                <textarea></textarea>
            </div>
            <div class="modal-footer">
                @if (isset($app_config["campaign"]["process_plaintext"]) && $app_config["campaign"]["process_plaintext"])
                    <button type="button" class="btn btn-default btn-plain-text">Plaintext</button>
                @endif
                {{-- Modal Upload --}}
                @if ($params['library_config']['esp'] && $params['library_config']['espProvider'])
                    <button type="button" class="btn btn-default btn-upload-api" data-campaign-id="{{ $params['campaign_id'] }}" data-api-driver="{{ $params['library_config']['espProvider'] }}">Upload to {{ config('esp.'. $params['library_config']['espProvider'] . 'title') }} </button>
                @endif
                @if (isset($params['library_config']['view_in_browser']) && $params['library_config']['view_in_browser'])
                    <a href="{{ url('campaign/public-path', $params['campaign_id']) }}" target="_blank" type="button"
                        class="btn btn-default">View in browser</a>
                @endif
                <button class="btn btn-default btn-back-to-dashboard" data-dismiss="modal">Go back to the dashboard</button>
            </div>
        </div>
    </div>
</div>
