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

    @media screen yahoo and (max-width:480px) {
        {{-- Mobile Yahoo Core Styles --}}
        @section('mobile_yahoo_core_styles')
            <?php echo getCssContent('css/mobile_core_styles.css'); ?>
        @show
        .st-hide-hack { display: none !important; }
        {{-- Mobile Yahoo Client Styles --}}
        @section('mobile_yahoo_client_styles')
            <?php echo getCssContent('css/mobile_client_styles.css'); ?>
        @show
    }

@show