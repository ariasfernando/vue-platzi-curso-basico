<div id="modal-campaign-preview" class="modal fade public-view-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4>Preview</h4>
            </div>

            <div class="modal-body">
                {{-- Send Preview --}}
                <div class="send-preview">
                    <form name="send-preview-form" id="send-preview-form">
                        <div class="form-group">
                            <label>Email address</label>
                            <div class="input-group">
                                <input type="text" class="form-control" name="send-preview-to" value="" placeholder="Enter your email address to preview your campaign" data-validation='{ "required":"true" }'/>
                                <button type="button" class="btn btn-default btn-send">Send</button>
                                <label class="info">Use a comma or a semicolon to separate multiple email addresses</label>
                            </div>
                        </div>
                    </form>
                </div>

                {{-- Share --}}
                <div class="share-preview">
                    <form class="form-inline">
                        <div class="form-group pull-right">
                            <label>Share url</label>
                            <div class="input-group">
                                <input type="text" class="form-control" readonly>
                                <span class="input-group-btn">
                                    <button class="btn btn-default" type="button">Copy</button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>

                {{-- Tabs --}}
                <div>
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation" class="active"><a href="#" class="btn-desktop" role="tab" data-toggle="tab"><i class="fa fa-desktop"></i>Desktop</a></li>
                        <li role="presentation"><a href="#" class="btn-mobile" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-phone"></i>Mobile</a></li>
                    </ul>
                </div>

                {{-- Preview --}}
                <div class="preview-body">
                    <div class="preview-container">
                        <div class="mobile-frame"></div>
                        <div class="iframe-container"><iframe id="email-preview-iframe" scrolling="no"></iframe></div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>