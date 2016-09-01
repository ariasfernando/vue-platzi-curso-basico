{{-- Zoom Control --}}
@if ( $params["image_crop"] == "enabled" )
    <div class="section-box-zoom modal-mpf-row">
        <div class="container-canvas relative">
            <label>Image zoom:</label>
            <input type="range" class="cropit-image-zoom-input" />
        </div>
    </div>
@endif