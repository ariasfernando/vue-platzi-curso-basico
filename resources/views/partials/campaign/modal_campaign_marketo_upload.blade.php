<div id="modal-campaign-upload-marketo" class="modal fade display-code-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4>Upload to {{ $app_config['api']['marketo']['title'] }}</h4>
            </div>
            <div class="modal-body">
                <div class="response-message response-message-success alert alert-success" style="display:none;">
                    Email successfully uploaded to {{ $app_config['api']['marketo']['title'] }}. <a href="{{ url('/') }}" class="allow-exit">View dashboard</a>.
                </div>
                <div class="response-message response-message-error alert alert-danger" style="display:none;">Something went wrong. Try again later.</div>
                <form name="upload-api-form" class="upload-api-form">
                    <input type="hidden" name="campaign_id" value="" class="campaign_id" />
                    <input type="hidden" name="api_driver" value="{{ $app_config['api']['marketo']['class'] }}" class="api_driver" />
                    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                    <div class="form-group">
                        <label for="filename">Filename (extension will be added automatically by stensul)</label>
                        <input type="text" class="form-control filename" name="filename" value=""
                            placeholder="Enter a name for your campaign" data-validation='{ "required":"true" }'/>
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
                <button type="button" class="btn btn-default btn-upload-submit" data-api-driver="marketo">Upload</button>
            </div>
        </div>
    </div>
</div>