<style type="text/css">
	a {
        text-decoration: none
    }

	/* Client-specific Styles */
	body.email-body {
        width:100% !important;
        -webkit-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
        background:#FFFFFF;
    }

    /* Force Outlook to provide a "view in browser" menu link. */
	#outlook a {
        padding: 0;
        text-decoration: none !important;
    }

	#backgroundTable {
        margin:0;
        padding:0;
        width:100% !important;
    }

    /* Force Hotmail to display emails at full width*/
	.ExternalClass {
        width:100%;
    }
	.ExternalClass * {
        line-height: 100%;
    }
    /*Force Hotmail to display normal line spacing.  More on that: http://www.emailonacid.com/forum/viewthread/43/ */
	.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
        line-height: 100%;
    }

	/*css generic*/
	a,a:hover,a:link,a:visited {
        text-decoration:none !important;
        outline: none;
    }

	hr {
        display: none !important;
    }

	@media screen and (max-width: 480px) {

		table.wrapper-table {
            width: 100% !important;
        }
        th.element-block-center,
		td.element-block-center {
            display: block !important;
            width: 100% !important;
            text-align: center !important;
            padding: 0 !important;
        }
		td.text-align-center {
            text-align: center !important;
        }
		td.mobile-margin {
            padding: 0 10px !important;
        }
		tr.show-device {
            display: block !important;
        }
		*.hidden-device {
            display: none !important;
        }
		div.show-img-device {
			display: table !important;
			width: 100% !important;
			float: none;
			overflow: visible !important;
			height: auto !important;
		}
		.display-mobile {
            display: block !important;
            width: 100% !important;
            overflow: visible !important;
            max-height: 100% !important;
        }
        .image-mobile{
            display:block!important;
            width: 100%!important;
            max-width: 100%!important;
        }
        .full-width {
            width: 100% !important;
        }
	}
    @if(isset($params['library_config']['propietaryCss']))
        {{ $params['library_config']['propietaryCss'] }}
    @endif
</style>

<!--[if mso]>
	<style>
		table[module-table-wrapper] {
            width: 560px !important;
        }
		td, span, p, a, h5, h6, div {
            font-family: Arial, Helvetica, sans-serif !important;
        }
	</style>
<![endif]-->

<!--[if gte mso 9]>
	<style>
		.mso-side-padding-20{ padding-left:20px;padding-right:20px; }
	</style>
<![endif]-->

<!--[if IEMobile]>
	<style type="text/css">
		td, span, p, a, h5, h6, div{font-family: Arial, Helvetica, sans-serif !important;}
	</style>
<![endif]-->