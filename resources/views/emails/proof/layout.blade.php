<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>  <!--[if IEMobile]>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="HandheldFriendly" content="true"/>
    <meta name="MobileOptimized" content="320"/>
    <meta name="viewport" content="width=device-width" />
    <title></title>

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

      @media  screen and (max-width: 480px) {

        img {
          max-width: 320px !important;
        }

        table.wrapper-table {
          width: 100% !important;
        }
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

    <!--[if IEMobile]>
      <style type="text/css">
        td, span, p, a, h5, h6, div{font-family: Arial, Helvetica, sans-serif !important;}
      </style>
    <![endif]-->
  </head>
  <body class="email-body">
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" bgcolor="#FFFFFF" style="vertical-align:top;">
          <table cellpadding="0"
              cellspacing="0"
              border="0"
              class="wrapper-table"
              width="600">
            <tr>
              <td align="left" valign="top" bgcolor="#ffffff" style="background-color: #ffffff;" class="mobile-margin">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td width="28" align="left" valign="top" class="hidden-device"></td>
                      <td align="left" valign="top">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td width="23" align="left" valign="top"></td>
                            </tr>
                            <tr>
                              <td height="20" align="left" valign="top"></td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
                                Hi {{ $user->name }},
                              </td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" height="22" style="height: 22px;"><!-- &nbsp; !--></td>
                            </tr>
                            {{-- email content: start --}}
                            @yield('content')
                            {{-- email content: end --}}
                            <tr>
                              <td align="left" valign="top" height="22" style="height: 22px;"><!-- &nbsp; !--></td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
                                Thanks,<br>
                                The stensul team
                              </td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" style="font-family:'Open Sans', Arial, Helvetica, sans-serif; font-size:15px; color:#666666; font-weight:300; line-height:22px; -webkit-text-size-adjust:none;">
                                <br>
                                <p>To ensure that you continue receiving our emails, please add <a href="mailto:{{ $from_email }}">{{ $from_email }}</a> to your address book or safe list.</p>
                                <p>If you received this email in error, please contact stensul at <a href="mailto:{{ $app_config['app_mail_address'] }}">{{ $app_config['app_mail_address'] }}</a> immediately.</p>
                              </td>
                            </tr>
                            <tr>
                              <td height="24" align="left" valign="top"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td width="28" align="left" valign="top" class="hidden-device"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
