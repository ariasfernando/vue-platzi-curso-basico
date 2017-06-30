<div id="modal-campaign-upload-responsys" class="modal fade display-code-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4>Upload to {{ $app_config['api']['responsys']['title'] }}</h4>
            </div>
            <div class="modal-body">
                <div class="response-message response-message-success alert alert-success" style="display:none;">
                    Email successfully uploaded to {{ $app_config['api']['responsys']['title'] }}. <a href="{{ url('/') }}" class="allow-exit">View dashboard</a>.
                </div>
                <div class="response-message response-message-error alert alert-danger" style="display:none;">Something went wrong. Try again later.</div>
                <div class="response-message response-message-error-duplicated alert alert-danger" style="display:none">
                    This name already exists and cannot be overriden.
                </div>
                <form name="upload-api-form" class="upload-api-form">
                    <input type="hidden" name="campaign_id" value="" class="campaign_id" />
                    <input type="hidden" name="api_driver" value="{{ $app_config['api']['responsys']['class'] }}" class="api_driver" />
                    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                    <input type="hidden" name="library_name" value="<?php echo (isset($params['campaign_data']) && isset($params['campaign_data']['library']))? $params['campaign_data']['library'] : 'default'; ?>" />
                    <div class="form-group">
                        <label for="filename">Filename (extension will be added automatically by stensul)</label>
                        <input type="text" class="form-control filename" name="filename" value=""
                            placeholder="Enter a name for your campaign" data-validation='{ "required":"true" }'/>
                        @if (isset($app_config['api']['responsys']['overwrte_file']) && $app_config['api']['responsys']["overwrte_file"])
                                <input type="checkbox" name="overwrite_file"/> Overwrite if file exists
                        @endif
                    </div>
                    <div class="uploaded-data" data-info="filename">
                        <label>File upload history:</label>
                        <table class="table table-condensed">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Filename</th>
                                    <th>stensul User</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-upload-submit" data-api-driver="responsys">Upload</button>
            </div>
        </div>
    </div>
</div>