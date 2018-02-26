export default function (selector, width) {
    let $canvas = null;

    $canvas = document.querySelector(selector);

    if ($canvas.querySelector('td').querySelector('table').querySelector('td.st-hide-hack') === null) {
        let $hack = $(`<tr>
            <td class="st-hide-hack">
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="${width}">
                    <tr>
                        <td cellpadding="0" cellspacing="0" border="0" height="1" style="background-color:#ffffff; line-height:1px; height: 1px; min-width: ${width}px;">
                            <img src="${Application.globals.baseUrl}/images/spacer.gif" height="1" width="${width}" style="max-height:1px; min-height:1px; display:block; width:${width}px; min-width:${width}px; border: 0;"/>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>`)[0]; 

        $canvas.querySelector('td').querySelector('table').prepend($hack);
    }
}