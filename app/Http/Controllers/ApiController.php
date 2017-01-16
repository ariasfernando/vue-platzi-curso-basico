<?php

namespace Stensul\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use Activity;
use Api;
use Config;
use Stensul\Http\Requests;
use Stensul\Models\User;
use Stensul\Models\Campaign;
use Stensul\Models\Upload;
use MongoDB\BSON\ObjectID as ObjectID;

class ApiController extends Controller
{
    /**
     * Create a new document
     *
     * @param  \Illuminate\Http\Request $request
     * @return json
     */
    public function postUploadEmail(Request $request)
    {
        $filename = $request->input('filename');
        $api_client = Api::driver($request->input('api_driver'));
        $campaign_data = Campaign::findOrFail($request->input('campaign_id'));
        if (Config::get('campaign.locking') &&
            (!Config::has('campaign.libraries' . $campaign_data->library . '.locking') ||
            Config::get('campaign.libraries' . $campaign_data->library . '.locking'))
        ) {
            $locked_name = Upload::lockedName($filename);
            if ($locked_name) {
                //return a conflict status code (409), when there is a duplicatd file for this api.
                return response()->json(['error' => 'duplicated'], 409);
            }
        }
        return $api_client->uploadEmail($campaign_data, $request->all());
    }

    /**
     * Get previous uploaded files
     *
     * @param  \Illuminate\Http\Request $request
     * @return json
     */
    public function getHistory(Request $request)
    {
        $resp = [];
        $campaign_id = $request->input('campaign_id');
        $history = Upload::where('campaign_id', '=', new ObjectID($campaign_id))
            ->orderBy('updated_at', 'desc')
            ->paginate(5)->toArray();

        if (count($history['data'])) {
            foreach (array_reverse($history['data']) as $v) {
                $user = User::find($v['user_id'])->toArray();
                $resp[] = array_merge($v, [
                    'date' => $v['created_at'],
                    'user' => $user['name']
                ]);
            }
        }
        return $resp;
    }

    /**
     * Get Public Images
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return json
     */
    public function getImages(Request $request)
    {
        $options = $request->all();

        $api_name = isset($options['api_name']) ? $options['api_name'] : null;
        $api_type = isset($options['api_type']) ? $options['api_type'] : null;

        $driver_name = !is_null($api_type) && $api_name == "scraper"
            ? 'Scraper\\' . ucfirst($api_type)
            : ucfirst($api_name);

        $library_name = isset($options['library_name'])
            ? strtolower($options['library_name'])
            : 'default';

        $config_search = is_null($api_type) || $api_type == ''
            ? "api." . $api_name . ".sources.libraries." . $library_name
            : "api." . $api_name . ".sources.libraries." . $library_name . "." . $api_type;

        $config_libraries = \Config::get($config_search, []);
        $options = array_merge($options, $config_libraries);
        $api_driver = Api::driver($driver_name, $options);

        if (!is_null($api_driver) && !empty($config_libraries)) {
            return $api_response = $api_driver->getPublicImages();
        } else {
            throw new \Exception("Api driver or options not found");
        }
    }

    /**
     * Oauth call
     *
     * @param  \Illuminate\Http\Request $request
     * @return Redirect or View
     */
    public function getOauth(Request $request)
    {
        $api_config = \Config::get("api");
        $api_client = Api::driver($api_config[$api_config['api_driver']]['class']);
        return $api_client->oauth($request);
    }
}
