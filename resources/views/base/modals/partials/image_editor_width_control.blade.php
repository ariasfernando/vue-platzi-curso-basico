{{-- Width adjustble --}}
@if ( isset($params["adjustable_width"]) && $params["adjustable_width"] == "enabled" )
<div class="section-box-width modal-mpf-row">
    <div class="container-canvas">
        <label class="canvas-size">Image width: <span id="adjustable-width-value">660</span>px</label>
        <div class="canvas-size-width-sel"></div>
    </div>
</div>
@endif