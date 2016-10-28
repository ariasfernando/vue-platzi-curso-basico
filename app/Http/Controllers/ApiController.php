<?php

namespace Stensul\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use Activity;
use Api;
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
        $api_client = Api::driver($request->input('api_driver'));
        $campaign_data = Campaign::findOrFail($request->input('campaign_id'));
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
}
