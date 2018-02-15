<style type="text/css">
	/* COMMON STYLES */
    .st-email-body{ 
        width:100% !important;
        -webkit-text-size-adjust: 100%;
        margin: 0 !important;
        padding: 0px; 
        background-color: #ffffff; 
    }

    #outlook a{
        padding:0;
        text-decoration:none!important
    }

    #backgroundTable{
        margin:0;
        padding:0;
        width:100%!important
    }

    .ExternalClass{
        width:100%
    }

    .ExternalClass *{
        line-height:100%
    }

    .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{
        line-height:100%
    }

    span.st-preheader{ 
        display: none!important;
    }  

    .applelinks {
        color:#ffffff !important; 
        text-decoration: none !important; 
    }  

	a,a:hover,a:link,a:visited {
        text-decoration:none !important;
        outline: none;
    }

	hr {
        display: none !important;
    }

    p {
        margin: 0;
        padding: 0;
    }

    @if(isset($params['campaign_data']['library_config']) && 
        isset($params['campaign_data']['library_config']['linkColor'])
    )
       a{
            color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
        }
        a *{ 
            color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
        }         
        a:link{ 
             color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
        }  
    @endif

    {{-- Mobile Styles --}}
    @include('layouts.partials.mobile_styles')

    @if(isset($params['campaign_data']['library_config']['propietaryCss']))
        {{ $params['campaign_data']->getLibraryConfig('propietaryCss') }}
    @endif

    <?php
        if (isset($params['campaign_data']['campaign_fonts'])) {
            if (isset($params['campaign_data']['campaign_fonts']['custom'])) {
                $fonts = $params['campaign_data']['campaign_fonts']['custom'];

                $fontPath = url('/') . "/fonts/";

                foreach ($fonts as $a => $font) {
                    $definition = "";
                    $ie = "";

                    foreach ($font['types'] as $b => $type) {
                        foreach ($type['files'] as $c => $file) {
                            if ($file['file'] === 'eot') {
                                $ie = "src: url('" . $fontPath . $font['folder'] . "/" . $file['name'] . "." . $file['file'] . "?#iefix');";
                            }
                        }
                    }

                    foreach ($font['types'] as $b => $type) {
                        $definition .= "@font-face {font-family: '" . $font['name'] . "';";
                        $definition .= $ie;
                        $definition .= "src: ";

                        foreach ($type['files'] as $c => $file) {
                            $definition .= "url('". $fontPath . $font['folder'] . "/" . $file['name'] . "." . $file['file'] . "') format('" . $file['file'] . "')";

                            if ($c < count($type['files']) - 1) {
                                $definition .= ",";
                            } else {
                                $definition .= ";";
                            }
                        }

                        $definition .= "font-weight: " . $type['weight'] . ";}";
                    }
                    echo $definition;
                }
            }
        }
    ?>
</style>

<!--[if mso]>
	<style>
		td, span, p, a, h5, h6, div {
            font-family: Arial, Helvetica, sans-serif !important;
        }

        @if(isset($params['campaign_data']['library_config']) && 
            isset($params['campaign_data']['library_config']['linkColor'])
        )
           a{
                color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
            }
          
            a *{ 
                color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
            } 
                    
            a:link{ 
                 color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
            }  
        @endif
	</style>
<![endif]-->

<!--[if gte mso 9]>
	<style>
        .st-mso-full-width{
            width: 100%;
        }
        @if(isset($params['campaign_data']['library_config']) && 
            isset($params['campaign_data']['library_config']['linkColor'])
        )
           a{
                color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
            }
          
            a *{ 
                color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
            } 
                    
            a:link{ 
                 color: {{ $params['campaign_data']->getLibraryConfig('linkColor') }};
            }  
        @endif
	</style>
<![endif]-->

<!--[if IEMobile]>
	<style type="text/css">
		td, span, p, a, h5, h6, div{font-family: Arial, Helvetica, sans-serif !important;}
	   .st-mso-full-width{
            width: 100%;
       }
        
    </style>
<![endif]-->