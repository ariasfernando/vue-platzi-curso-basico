<div class="modal-mpf-content-data" id="header-text-with-body-config">
    <h1>Header Line of Text, plus body of text below</h1>
    {!! Form::open ( array ( 'method' => 'post', 'files' => true )) !!}

        <!-- Colorpicker -->
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