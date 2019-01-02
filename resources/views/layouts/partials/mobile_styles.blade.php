@section('mobile_styles')
    {{-- Mobile styles for breakpoint: 480px --}}
    @media screen and (max-width: 480px) {
        {{-- Mobile Core Styles --}}
        @section('mobile_core_styles')
            <?php echo getCssContent('css/mobile_core_styles.css'); ?>
        @show
        .st-hide-hack { display: none !important; }
    }
@show
