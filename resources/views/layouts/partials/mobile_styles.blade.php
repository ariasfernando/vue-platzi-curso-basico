@section('mobile_styles')
    {{-- Mobile styles for breakpoint: 480px --}}
    @media screen and (max-width: 480px) {

        {{-- Mobile Core Styles --}}
        @section('mobile_core_styles')
            <?php
                try
                {
                    echo Storage::disk('local:public')->get('css/mobile_core_styles.css');
                }
                catch (Illuminate\Contracts\Filesystem\FileNotFoundException $e)
                {
                    Activity::log("The file doesn't exist: " . $e->getMessage());
                }
            ?>
        @show
        
        {{-- Mobile Client Styles --}}
        @section('mobile_client_styles')
             <?php
                try
                {
                    echo Storage::disk('local:public')->get('css/mobile_client_styles.css');
                }
                catch (Illuminate\Contracts\Filesystem\FileNotFoundException $e)
                {
                    Activity::log("The file doesn't exist: " . $e->getMessage());
                }
            ?>
        @show
        .st-hide-hack { display: none !important; }
    }
@show