<div id="modal-proof-message" class="modal fade" tabindex="-2" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">

            <div class="modal-header">
                <h4>Write a message</h4>
            </div>

            <div class="modal-body">
                <div class="proof-add-message">
                    {!! Form::hidden('proof-current-row', null) !!}
                    <div class="form-group">
                        {!! Form::textarea('notification_message', '', ['class' => 'form-control', 'rows' => 3, 'maxlength' => 200]) !!}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-cancel">Cancel</button>
                <button class="btn btn-default" id="btn-proof-message">Add message</button>
            </div>

        </div>
    </div>
</div>
