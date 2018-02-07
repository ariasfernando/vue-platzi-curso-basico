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

    @media  screen and (max-width: 480px) {
        /*BASE-LAYOUT*/
        .st-wrapper {width: 100% !important;}
        .st-wrapper-content{ padding: 0px !important;}
        .st-wrapper-table { width: 100% !important; }
        .st-col{ display: block!important; width: 100%!important; padding: 0px !important;}
        .st-resize{ width: 100%!important; display: block!important; height: auto !important;}
    }

    @if(isset($params['campaign_data']['library_config']['propietaryCss']))
        {{ $params['campaign_data']->getLibraryConfig('propietaryCss') }}
    @endif

    @if(isset($params['campaign_data']['campaign_fonts']))
        @foreach ($params['campaign_data']['campaign_fonts'] as $font_group => $fonts)
            @if($font_group === 'custom')
                @foreach ($fonts as $font)
                    @font-face {
                        font-family: "{{ $font }}";
                        src: url('{{ url("/") }}/images/{{str_replace(' ', '', $font) }}.eot') format('eot');
                        src: url('{{ url("/") }}/images/{{str_replace(' ', '', $font) }}.eot?#iefix') format('embedded-opentype'),
                        src: url('{{ url("/") }}/images/{{str_replace(' ', '', $font) }}.woff') format('woff'),
                        src: url('{{ url("/") }}/images/{{str_replace(' ', '', $font) }}.ttf') format('truetype'),
                        src: url('{{ url("/") }}/images/{{str_replace(' ', '', $font) }}.svg') format('svg');
                    }
                @endforeach
            @endif
        @endforeach
    @endif

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