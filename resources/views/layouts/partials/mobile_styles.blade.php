@section('mobile_styles')
    {{-- Mobile styles for breakpoint: 480px --}}
    @media screen and (max-width: 480px) {

        {{-- Mobile Core Styles --}}
        @section('mobile_core_styles')
            <?php 
                try
                {
                    echo File::get('css/mobile_core_styles.css');
                }
                catch (Illuminate\Filesystem\FileNotFoundException $exception)
                {
                    die("The file doesn't exist");
                }
            ?>
        @show
        
        {{-- Mobile Client Styles --}}
        @section('mobile_client_styles')
             <?php 
                try
                {
                    echo File::get('css/mobile_client_styles.css');
                }
                catch (Illuminate\Filesystem\FileNotFoundException $exception)
                {
                    die("The file doesn't exist");
                }
            ?>
        @show
    }
@show