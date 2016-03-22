{{-- Height adjustble --}}
@if ( isset($params["adjustable_height"]) && $params["adjustable_height"] == "enabled" )
<div class="section-box-height modal-mpf-row">
    <div class="container-canvas">
        <label class="canvas-size">Image height: <span id="adjustable-height-value">660</span>px</label>
        <div class="canvas-size-sel"></div>
    </div>
</div>
@endif