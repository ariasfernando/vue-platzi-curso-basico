<div class="modal-mpf-content-data master-image-editor" id="hero-image-bg-editor">
    <h1>Hero Image Background</h1>
    {!! Form::open ( array ( 'method' => 'post', 'files' => true ,'id' => 'master-image-editor-form'  )) !!}
        {{-- Input Hidden --}}
        {!! Form::hidden(
            'campaign_id',
            isset($params["campaign_id"])? $params["campaign_id"]:'',
            array ( 'id' => 'campaign-id' ))
        !!}

        <div class="modal-mpf-row">
            {!! Form::label('button-link-url', 'Button URL') !!}
            {!! Form::text('button-link-url','',array (
                'class' => 'button-link-url url-format',
                'placeholder' => 'https://www.example.com',
                'data-validation' => '{"required":"true","url":"true"}'))
            !!}
        </div>

        {{-- File Upload --}}
        <div class="modal-mpf-row" id="file-upload-box">
            {!! Form::label('file-image-upload', 'Background image') !!}
            <small class="text-info">Maximum allowed size: 2mb. Allowed file types: png, jpg and gif.</small>
            {!! Form::file(
                'file-image-upload',
                array (
                    'id' => 'file-image-upload',
                    'class' => 'cropit-image-input',
                    'accept' => 'image/*',
                    'data-validation' => '{"required":"false"}'
                ))
            !!}
        </div>

        <div class="tab-content">
            <div id="image-cropper" class="init-cropper">
                <div class="section-box preview-box">
                    <div class="modal-two-column">
                        
                        <div class="section-box-zoom modal-mpf-row">
                            <div class="container-canvas relative">
                                <label>Image zoom:</label>
                                <input type="range" class="cropit-image-zoom-input" />
                            </div>
                        </div>

                        <div class="modal-mpf-row"></div>
                    </div>        
                    
                    <div class="section-title"><h2>Preview Image</h2></div>
                    
                    <div class="cropit-preview"></div>
                
                </div>
            </div>
        </div>

        {{-- Input submit --}}
        <div class="modal-mpf-submit">
            {!! Form::submit('Submit', array ( 'class' => 'btn btn-success submit-config pull-right', 'id'=>'master-image-editor-upload' )) !!}
        </div>
    {!! Form::close() !!}
</div>