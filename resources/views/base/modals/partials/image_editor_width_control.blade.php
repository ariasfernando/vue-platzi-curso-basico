{{-- Width adjustble --}}
@if ( isset($params["adjustable_width"]) && $params["adjustable_width"] == "enabled" )
<div class="section-box-width modal-mpf-row">
    <label class="canvas-size">Image width: <span id="adjustable-width-value">660</span>px</label>
    <input type="range" class="cropit-image-width-input" />
</div>
@endif