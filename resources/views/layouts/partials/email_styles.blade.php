@if (isset($params['campaign_data']['campaign_fonts']))
    @if (isset($params['campaign_data']['campaign_fonts']['custom']))
        <?php
            $fonts = $params['campaign_data']['campaign_fonts']['custom'];
        ?>
        @foreach ($fonts as $a => $font)
            @if (isset($font['url']))
                <link href="{{ $font['url'] }}" rel="stylesheet" type="text/css">
            @endif
        @endforeach
    @endif
@endif
<style type="text/css">
	/* COMMON STYLES */
    span, td, table, div {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .st-email-body{
        width:100% !important;
        -webkit-text-size-adjust: 100%;
        margin: 0 auto!important;
        padding: 0px;
        background-color: #ffffff;
    }

    #outlook a{
        padding:0;
        text-decoration:none!important
    }

    table{
        border-collapse: collapse;
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
        !empty($params['campaign_data']['library_config']['linkColor'])
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

    <?php
        if (isset($params['campaign_data']['campaign_fonts'])) {
            if (isset($params['campaign_data']['campaign_fonts']['custom'])) {
                $fonts = $params['campaign_data']['campaign_fonts']['custom'];

                $fontPath = url('/') . "/fonts/";

                foreach ($fonts as $a => $font) {
                    if ((isset($font['folder']) || (isset($font['source']) && $font['source'] === 'studio')) && (empty($params['campaign_data']['campaign_fonts_used']) || in_array($font['name'], $params['campaign_data']['campaign_fonts_used']))) {
                        $definition = "";
                        $ie = "";

                        foreach ($font['types'] as $b => $type) {
                            foreach ($type['files'] as $c => $file) {
                                if ($file['file'] === 'eot') {
                                    if (isset($font['folder'])) {
                                        $ie = "src: url('" . $fontPath . $font['folder'] . "/" . $file['name'] . "." . $file['file'] . "?#iefix');";
                                    } else {
                                        $ie = "src: url('" . $fontPath . "customer/" . $file['name'] . "?#iefix');";
                                    }
                                }
                            }

                            $definition .= "@font-face {font-family: '" . $font['name'] . "';";
                            $definition .= $ie;
                            $definition .= "src: ";

                            foreach ($type['files'] as $c => $file) {
                                if (isset($font['folder'])) {
                                    $definition .= "url('". $fontPath . $font['folder'] . "/" . $file['name'] . "." . $file['file'] . "') format('" . $file['file'] . "')";
                                } else {
                                    $definition .= "url('". $fontPath . "customer/" . $file['name'] . "') format('" . $file['file'] . "')";
                                }
                                if ($c < count($type['files']) - 1) {
                                    $definition .= ",";
                                } else {
                                    $definition .= ";";
                                }
                            }

                            if(isset($type['style']) && !empty($type['style'])) {
                                $definition .= "font-style: " . $type['style'] . ";";
                            }

                            $definition .= "font-weight: " . $type['weight'] . ";}";
                            $ie = "";
                        }
                        echo $definition;
                    }
                }
            }
        }
    ?>
</style>

{{-- Client Styles --}}
@if(isset($params['campaign_data']['library_config']['propietaryCss']))
    {!! $params['campaign_data']->getLibraryConfig('propietaryCss') !!}
@endif

<!--[if mso]>
	<style>
		td, span, p, a, h5, h6, div {
            font-family: Arial, Helvetica, sans-serif !important;
        }

        @if(isset($params['campaign_data']['library_config']) &&
            !empty($params['campaign_data']['library_config']['linkColor'])
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
        span.MsoHyperlink {
            mso-style-priority:99;
            color:inherit;
        }
        span.MsoHyperlinkFollowed {
            mso-style-priority:99;
            color:inherit;
        }
	</style>
<![endif]-->

<!--[if gte mso 9]>
	<style>
        .st-mso-full-width{
            width: 100%;
        }
        @if(isset($params['campaign_data']['library_config']) &&
            !empty($params['campaign_data']['library_config']['linkColor'])
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

<!--[if IE]>
   <style type="text/css">
        .mso-img-centered > table {
            width: auto!important;
            margin: 0 auto!important;
        }
        .mso-img-centered > table > tbody > tr > td {
            margin: 0 auto!important;
        }
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

@if(isset($params['campaign_data']['style']['outlook']))
    {!! $params['campaign_data']['style']['outlook'] !!}
@endif
{{-- Client Styles --}}
@if(isset($params['campaign_data']['library_config']['propietaryCss']))
    {!! $params['campaign_data']->getLibraryConfig('propietaryCss') !!}
@endif
