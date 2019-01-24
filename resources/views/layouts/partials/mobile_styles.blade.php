@section('mobile_styles')
    {{-- Mobile styles for breakpoint: 480px --}}
    @media screen and (max-width: 480px) {
        {{-- Mobile Core Styles --}}
        @section('mobile_core_styles')
            <?php echo getCssContent('css/mobile_core_styles.css'); ?>
        @show
        .st-hide-hack { display: none !important; }
    {{-- Mobile Client Styles --}}
        @section('mobile_client_styles')
            <?php echo getCssContent('css/mobile_client_styles.css'); ?>
        @show
    }
@show
