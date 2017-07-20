<?php

namespace Stensul\Http\Controllers;

use Auth;
use Stensul\Models\Campaign;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Services\TagManager as Tag;
use MongoDB\BSON\Regex as MongoRegex;

class DashboardController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Dashboard Controller
    |--------------------------------------------------------------------------
    |
    | This controller renders your application's "dashboard" for users that
    | are authenticated. Of course, you are free to change or remove the
    | controller as you wish. It is just here to get your app started!
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('Authenticate');
        $this->middleware('acl.permission:access_dashboard');
    }

    /**
     * Show the application dashboard to the user.
     *
     * @return View
     */
    public function index()
    {
        $params = [
            'locales' => \Config::get('locales'),
            'libraries' => Auth::user()->getLibraries()
        ];

        return $this->renderView('dashboard', ['params' => $params]);
    }

    public function getCampaigns(Request $request, $type)
    {
        $user_visibility = array_map(function ($library) {
            return new ObjectID($library['_id']);
        }, Auth::user()->getLibraries());

        $campaigns = Campaign::where('status', '!=', 2);

        switch ($type) {
            case 'current':
                $campaigns->where('processed', '=', 0, 'AND');
                break;
            case 'finished':
                $campaigns->where('processed', '=', 1, 'AND');
                break;
        }

        if (\Config::get('campaign.enable_templating')) {
            if ($type == 'template') {
                $campaigns->where('template', '=', true, 'AND');
            } else {
                $campaigns->whereIn('template', [null, false]);
            }
        }

        if (count($user_visibility) !== 0) {
            $campaigns->whereIn('library', $user_visibility);
        }

        // search
        if (\Config::get('campaign.enable_search')) {
            $search_terms = $request->input('terms', []);
            if (count($search_terms)) {
                $fields_to_search = \Config::get('campaign.search_settings.fields_to_search');
                foreach ($search_terms as $search_key) {
                    $campaigns->where(
                        function ($query) use ($fields_to_search, $search_key) {
                            foreach ($fields_to_search as $field) {
                                $query->orWhere($field, 'like', "%" . $search_key . "%");
                                if (\Config::get('campaign.enable_tagging')) {
                                    // search terms should also be reviewed as tags
                                    $query->orWhere(function ($q) use ($search_key) {
                                        $q->whereIn('tags', [new MongoRegex('/^'.$search_key.'$/i')]);
                                    });
                                }
                            }
                        }
                    );
                }
            }

            // filter by tags
            if (\Config::get('campaign.enable_tagging')) {
                $search_tags = $request->input('tags', []);
                if (count($search_tags)) {
                    foreach ($search_tags as $search_key) {
                        $campaigns->where(function ($query) use ($search_key) {
                            $query->whereIn('tags', [new MongoRegex('/^'.$search_key.'$/i')]);
                        });
                    };
                }
            }
        }

        // apply sort
        $sort = strlen($request->input('sort')) ? $request->input('sort', 'updated_at') : 'updated_at';
        $direction = strlen($request->input('direction')) ? $request->input('direction', 'updated_at') : 'desc';
        $campaigns->orderBy($sort, $direction);

        return $campaigns->paginate(5);
    }

    public function getTags()
    {
        return Tag::getTagNames();
    }
}
