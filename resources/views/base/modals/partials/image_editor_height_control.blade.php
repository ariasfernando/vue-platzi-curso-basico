{{-- Height adjustble --}}
@if ( isset($params["adjustable_height"]) && $params["adjustable_height"] == "enabled" )
<div class="section-box-height modal-mpf-row">
    <label class="canvas-size">Image height: <span id="adjustable-height-value">660</span>px</label>
    <input type="range" class="cropit-image-height-input" />
</div>
@endif