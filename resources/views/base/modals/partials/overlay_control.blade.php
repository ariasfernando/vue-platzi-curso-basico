{{-- Overlay control --}}
<div id="{{ $container_id or '' }}" class="modal-mpf-row">
    <label class="switch-light switch-stensul" onclick="">
        {!! Form::checkbox($input_id, '', null, array ( 'id' => $input_id, 'checked'=>'checked') )!!}
        <span>{{ $label or 'Show overlay' }}<span>Off</span><span>On</span></span>
        <a></a>
    </label>
</div>