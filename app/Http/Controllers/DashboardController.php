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

    private static $campaign_fields = [
        '_id',
        'campaign_name',
        'user_email',
        'status',
        'tags',
        'library',
        'template',
        'locked',
        'locked_by',
        'created_at',
        'created_email',
        'updated_at',
        'published_at'
    ];

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

        if (count($user_visibility) !== 0) {
            $campaigns->whereIn('library', $user_visibility);
        }

        if (\Config::get('campaign.enable_search')) {
            $this->searchFilter($campaigns, $request->input('terms', []));

            if (\Config::get('campaign.enable_tagging')) {
                $this->tagsFilter($campaigns, $request->input('tags', []));
            }
        }

        // apply sort
        $sort = strlen($request->input('sort')) ? $request->input('sort', 'updated_at') : 'updated_at';
        $direction = strlen($request->input('direction')) ? $request->input('direction', 'updated_at') : 'desc';
        $campaigns->orderBy($sort, $direction);

        return $campaigns->paginate(5, self::$campaign_fields);
    }

    public function getTags()
    {
        return Tag::getTagNames();
    }

    private function tagsFilter($campaigns, $tags)
    {
        $search_tags = $tags;
        if (count($search_tags)) {
            $campaigns->where(function ($query) use ($search_tags) {
                $query->where('tags', 'all', $search_tags);
            });
        }
    }

    private function searchFilter($campaigns, $terms)
    {
        $search_terms = $terms;
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
                                    $q->whereIn('tags', [new MongoRegex('^' . $search_key . '$', 'i')]);
                                });
                            }
                        }
                    }
                );
            }
        }
    }

    public function getTemplates(Request $request, $type)
    {
        $user_visibility = array_map(function ($library) {
            return new ObjectID($library['_id']);
        }, Auth::user()->getLibraries());

        $campaigns = Campaign::where('status', '!=', 2);
        $campaigns->where('template', '=', true, 'AND');

        if (count($user_visibility) !== 0) {
            $campaigns->whereIn('library', $user_visibility);
        }

        $total = $campaigns->count();
        $current_page = (int) $request->input('page');
        $per_page = 5;
        $from = ($current_page == 1 ) ? (int) $current_page : (int) ($per_page * ($current_page - 1)) ;
        $to = ($from + ($per_page - 1) <= $total) ? $from + ($per_page - 1) : $total ;
        $last_page = ($total <= $per_page) ? 1 : ($total % 5) ? (int) ($total / 5) + 1 : (int) ($total / 5);

        if ($current_page != 1) {
            $prev_page_url = \Config::get('app.url') . '/dashboard/templates/current/?page=' . ($current_page - 1);
        } else {
            $prev_page_url = null;
        }

        if ($last_page > $current_page) {
            $next_page_url = \Config::get('app.url') . '/dashboard/templates/template/?page='
                . (string) ($current_page + 1);
        } else {
            $next_page_url = null;
        }

        if (\Config::get('campaign.enable_search')) {
            $this->searchFilter($campaigns, $request->input('terms', []));

            if (\Config::get('campaign.enable_tagging')) {
                $this->tagsFilter($campaigns, $request->input('tags', []));
            }
        }

        if (\Config::get('campaign.enable_favorite_template')) {
            $favorite_type = \Config::get('campaign.favorite_settings.type');
            if ($favorite_type === "global") {
                $campaigns->orderBy('favorite', 'desc');
                $sort = strlen($request->input('sort')) ? $request->input('sort', 'updated_at') : 'updated_at';
                $direction = strlen($request->input('direction')) ? $request->input('direction', 'updated_at') : 'desc';
                $campaigns->orderBy($sort, $direction);
            } elseif ($favorite_type === "user") {
                $campaigns_array = $campaigns->get();
                $campaigns_array = $campaigns_array->sortBy(function ($campaign, $key) {
                    $users = $campaign->favorite_user()->get();
                    if (count($users)) {
                        if (count($campaign->favorite_user()->find(["_id", Auth::id()]))) {
                            $campaign->favorite = true;
                            return false;
                        } else {
                            $campaign->favorite = false;
                            return true;
                        }
                    } else {
                        $campaign->favorite = false;
                        return true;
                    }
                });
                if (strlen($request->input('sort'))) {
                    $sort = $request->input('sort', 'updated_at');
                    if (!strlen($request->input('direction')) ||  $request->input('direction') == 'asc') {
                        $campaigns_array = $campaigns_array->sortBy($sort);
                    } else {
                        $campaigns_array = $campaigns_array->sortByDesc($sort);
                    };
                }
            }
        }

        if (isset($campaigns_array)) {
            $result = [];
            $x = ($current_page == 1 ) ? 1 : 0;
            foreach ($campaigns_array as $key => $value) {
                if ($x >= $from && $x <= $to) {
                    $result[] =  $value;
                }
                $x++;
            }
            return array(
                'current_page' => $current_page,
                'from' => $from,
                'last_page' => $last_page,
                'next_page_url' => $next_page_url,
                'per_page' => $per_page,
                'prev_page_url' => $prev_page_url,
                'to' => $to,
                'total' => $total,
                'data' => $result
            );
        } else {
            return $campaigns->paginate(5, self::$campaign_fields);
        }
    }
}
