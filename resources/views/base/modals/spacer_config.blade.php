<div class="modal-mpf-content-data" id="spacer-config">
    <h1>Custom Spacer</h1>
    {!! Form::open ( array ( 'method' => 'post', 'files' => true )) !!}
        <!-- Input pretext -->

        <div class="modal-mpf-row">
            {!! Form::label('spacer-size', 'Choose spacer height') !!}
            <div class="spacer-size-list">
            @foreach ($app_config['modules']['spacer']['sizes']['list'] as $val => $size)
                <span class="spacer-size" data-value="{{ $val }}">{{ $size }}</span>
            @endforeach
            </div>
        </div>

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