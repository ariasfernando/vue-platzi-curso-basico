<div class="modal-mpf-content-data simple-text-config admin-module-form">
    <h1>{{ $params['title'] }}</h1>

    {!! Form::open ( array ( 'method' => 'post' ,'id' => 'admin-module-form' )) !!}

    <div>
        <ul class="nav nav-tabs" role="tablist">
            <li class="active" role="presentation"><a href="#module-conf" class="btn-upload" role="tab" data-toggle="tab">General</a></li>
            <li role="presentation"><a href="#module-conf-template" class="btn-upload" role="tab" data-toggle="tab">Template</a></li>
        </ul>
    </div>
    <div class="tab-content">
        <div class="tab-pane active" role="tabpanel" id="module-conf">

            <div class="modal-mpf-row">
                {!! Form::text('module_title', isset($params['module']['title']) ? $params['module']['title'] : '', array (
                    'class' => 'module-title',
                    'id' => 'module_title',
                    'placeholder' => 'Enter module title here.',
                    'data-validation' => '{"required":"true"}'
                )) !!}
            </div>

            <div class="modal-mpf-row">
                {!! Form::text('module_id', isset($params['module']['module_id'])? $params['module']['module_id'] : '', array (
                    'class' => 'module-id',
                    'id' => 'module_id',
                    'placeholder' => 'Enter module ID here.',
                    'data-validation' => '{"required":"true"}'
                )) !!}
            </div>

            <div class="modal-mpf-row">
                {!! Form::text('module_description', isset($params['module']['module_id'])? $params['module']['module_id'] : '', array (
                    'class' => 'module-description',
                    'id' => 'module_description',
                    'placeholder' => 'Enter module description here.',
                    'data-validation' => '{"required":"true"}'
                )) !!}
            </div>
            @if ( isset($params['modules']) )
                <div class="modal-mpf-row selector">
                    {!! Form::select('parent_module', $params['modules'], isset($params['module']['modules']) ? $params['module']['modules'] : '',array (
                        'class' => 'form-control selectpicker',
                        'id' => 'parent_module',
                        'title' => 'Choose one module to duplicate',
                        'data-validation' => '{"required":"true"}'
                    )); !!}
                </div>
            @endif
            <div class="modal-mpf-row">
                {!! Form::textarea('module_config', isset($params['module']['config'])
                    ? json_encode($params['module']['config'], JSON_PRETTY_PRINT) : '', array (
                    'class' => 'module-config',
                    'id' => 'module_config',
                    'placeholder' => 'Enter config JSON here.',
                    'data-validation' => '{"required":"true"}'
                )) !!}
            </div>
        </div>
        <div class="tab-pane" role="tabpanel" id="module-conf-template">
            <div class="">
                {!! Form::textarea('module_template', isset($params['module']['template']) ? $params['module']['template'] : '', array (
                    'class' => 'module-template',
                    'id' => 'module_template',
                    'placeholder' => 'Enter template code here.',
                    'data-validation' => '{"required":"true"}'
                )) !!}
            </div>
        </div>
    <div>

    <div class="modal-mpf-submit">
        {!! Form::submit('Submit', array ( 'class' => 'btn btn-success pull-right submit-config')) !!}
    </div>
    {!! Form::close() !!}
</div>