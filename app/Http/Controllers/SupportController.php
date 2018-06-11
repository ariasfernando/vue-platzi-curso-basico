<?php
namespace Stensul\Http\Controllers;

use Auth;
use Carbon\Carbon;
use Firebase\JWT\JWT;

class SupportController extends Controller
{
    public function support($section)
    {
        // Help is not enabled. Return 404 if they try to access the url directly.
        if (!config('support.enabled')) {
            abort(404);
        }
        $section_config = config('support.sections.' . $section);
        // section does not exist. Return 404.
        if (empty($section_config)) {
            abort(404);
        }
        $user = Auth::user();

        if (is_array($section_config['url'])) {
            $return_to = (in_array(config('support.supported_role_name'), $user->roles)) ? $section_config['url']['supported'] : $section_config['url']['non_supported'];
        } else {
            $return_to = $section_config['url'];
        }
        $key = config('services.zendesk.shared_key');
        $now = time();
        $token = [
            'jti'  => md5($now . rand()),
            'iat'  => $now,
            'name' => $user->name,
            'email' => $user->email,
            'organization' => config('services.zendesk.organization'),
            'external_id' => $user->_id,
            'role' => 'user'
        ];
        $jwt = JWT::encode($token, $key, array('HS256'));
        $url = config('services.zendesk.login_url') . '?jwt=' . $jwt . '&return_to=' . $return_to;
        return redirect($url);
    }
}
