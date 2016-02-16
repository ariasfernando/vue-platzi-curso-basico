<div class="modal-mpf-content-data" id="colored-bar-config">
	<h1>Full width colored bar w/text</h1>
	{!! Form::open ( array ( 'method' => 'post', 'files' => true )) !!}
        <div class="modal-mpf-row">
            {!! Form::label('bg-option-selected', 'Choose background color') !!}
            <div class="color-picker-container"><select name="bg-option-selected"></select></div>
        </div>

        <!-- Input submit  -->
        <div class="modal-mpf-submit">
            {!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
        </div>
	{!! Form::close() !!}
</div>