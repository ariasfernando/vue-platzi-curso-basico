<div class="modal-mpf-content-data" id="image-plus-text-config">
    <h1>Image + Text</h1>
    {!! Form::open ( array ( 'method' => 'post', 'files' => true )) !!}
        <!-- Link 1 -->
        <div class="modal-mpf-row">
            {!! Form::label('first-link-url', 'Link url') !!}
            {!! Form::text('first-link-url','',array (
                'class' => 'url-format',
                'placeholder' => 'https://www.example.com',
                'data-validation' => '{"required":"true","url":"true"}'))
            !!}
        </div>

        <!-- Input submit  -->
        <div class="modal-mpf-submit">
            {!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
        </div>
    {!! Form::close() !!}
</div>