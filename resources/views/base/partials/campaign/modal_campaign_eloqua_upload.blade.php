<div id="modal-campaign-upload" class="modal fade display-code-modal" tabindex="-1" role="dialog" aria-hidden="true">
    @if(isset($app_config['api']) && $app_config['api']['upload_modal'])
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4>Upload to {{ $app_config['api'][ $app_config['api']['api_driver'] ]['title'] }}</h4>
                </div>
                <div class="modal-body">
                    <div class="response-message-success alert alert-success" style="display:none;">
                        Email successfully uploaded to Eloqua. <a href="{{ url('/') }}" class="allow-exit">View dashboard</a>.
                    </div>
                    <div class="response-message-error alert alert-danger" style="display:none;">Something went wrong. Try again later.</div>
                    <form name="upload-api-form" id="upload-api-form">
                        <input type="hidden" name="campaign_id" value="" id="campaign_id" />
                        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                        <div class="form-group">
                            <label for="filename">Filename (extension will be added automatically by stensul)</label>
                            <input type="text" class="form-control" name="filename" id="filename" value=""
                                placeholder="Enter a name for your campaign" data-validation='{ "required":"true" }'/>
                        </div>
                        <div id="uploaded-data" data-info="filename">
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
                    <button type="button" class="btn btn-default btn-upload-api">Upload</button>
                </div>
            </div>
        </div>
    @endif
</div>