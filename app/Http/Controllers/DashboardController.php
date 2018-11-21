<?php

namespace Stensul\Http\Controllers;

use Auth;
use Campaign as CampaignManager;
use CampaignModel as Campaign;
use LibraryModel as Library;
use SettingModel as Setting;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID as ObjectID;
use Tag;
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
        'status',
        'tags',
        'library',
        'template',
        'locked',
        'locked_by',
        'updated_by',
        'created_by',
        'created_at',
        'updated_at',
        'published_at',
        'proof_id',
        'archive'
    ];

    const RESULTS_X_PAGE = 10;

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
        $flash_messages = [
            'campaign_lock',
            'campaign_not_found',
            'campaign_permission',
            'campaign_create'
        ];
        $flash = '';
        foreach ($flash_messages as $message) {
            if (session()->has($message)) {
                $flash = $message;
            }
        }

        $params = [
            'locales' => \Config::get('locales'),
            'libraries' => Auth::user()->getLibraries(),
            'flash' => $flash,
            'locked_by' => CampaignManager::whoIsLocking(session()->get('campaign_lock'))
        ];
        return $this->renderView('dashboard', ['params' => $params]);
    }

    /**
     * Get libraries for which the user has permission.
     *
     * @return array
     */
    public function getLibraries()
    {
        return Auth::user()->getLibraries();
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

        // ignore templates
        $campaigns->whereIn('template', [null, false]);

        if (count($user_visibility) !== 0) {
            $campaigns->whereIn('library', $user_visibility);
        }

        if (!Auth::user()->hasRole(env('INTERNAL_ROLE', 'stensul-internal'))) {
            $campaigns->where('internal', false);
        }

        if (\Config::get('campaign.enable_search')) {
            $this->searchFilter($campaigns, $request->input('terms', []));

            if (\Config::get('campaign.enable_tagging')) {
                $this->tagsFilter($campaigns, $request->input('tags', []));
            }
        }

        // apply sort
        $sort = strlen($request->input('sort')) ? $request->input('sort', 'updated_at') : 'updated_at';

        if ($sort === 'library_name') {
            $sort = 'library';
        } elseif ($sort == 'campaign_name') {
            $sort = 'lower_campaign_name';
        }

        $direction = strlen($request->input('direction')) ? $request->input('direction', 'updated_at') : 'desc';
        $campaigns->orderBy($sort, $direction);

        /** Filter code **/
        $filters = $request->input('filters', []);
        if (Auth::user()->can("access_archive") && empty($filters)) {
            $campaigns->where('archive', false);
        }
        /** End Filter code **/

        $this->filterParams($campaigns, $filters);

        $result = $campaigns->paginate(self::RESULTS_X_PAGE, self::$campaign_fields);
        $libraries = [];
        foreach (Auth::user()->getLibraries() as $library) {
            $libraries[$library['_id']] = $library['name'];
        }
        foreach ($result as $key => $campaign) {
            if (isset($libraries[(string) $campaign->library])) {
                $result[$key]->library_name = $libraries[(string) $campaign->library];
            }
        }
        return $result;
    }

    /**
     * filterParams
     *
     * @param Object $campaigns
     * @param Array  $filters
     */
    private function filterParams($campaigns, $filters)
    {
        if (count($filters)) {
            foreach ($filters as $filter) {
                // This is the part of the code where you take the filter param
                // and make your desire custom query
                switch ($filter) {
                    case 'all':
                        // Show all the campaigns if user have access_archive role
                        if (Auth::user()->can("access_archive")) {
                            $campaigns->where('archive', '!=', null);
                        }
                        break;
                    case 'archived':
                        // Show the archived campaigns if user have access_archive role
                        if (Auth::user()->can("access_archive")) {
                            $campaigns->where('archive', true);
                        }
                        break;
                }
            }
        }
    }

    public function getTags()
    {
        return Tag::getTagList();
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

        if (!Auth::user()->can('access_unfixed_templates')) {
            $campaigns->where('locked', '=', true, 'AND');
        }

        if (!Auth::user()->hasRole(env('INTERNAL_ROLE', 'stensul-internal'))) {
            $campaigns->where('internal', false);
        }

        $total = $campaigns->count();
        $current_page = (int) $request->input('page');
        $per_page = self::RESULTS_X_PAGE;
        $from = ($current_page == 1 ) ? (int) $current_page : (int) ($per_page * ($current_page - 1)) ;
        $to = ($from + ($per_page - 1) <= $total) ? $from + ($per_page - 1) : $total ;
        $last_page = ($total <= $per_page) ? 1 : ($total % $per_page) ? (int) ($total / $per_page) + 1 : (int) ($total / $per_page);

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

        /** Filter code **/
        $filters = $request->input('filters', []);
        if (Auth::user()->can("access_archive") && empty($filters)) {
            $campaigns->where('archive', false);
        }
        $this->filterParams($campaigns, $filters);
        /** End Filter code **/

        if (\Config::get('campaign.enable_favorite_template')) {
            $favorite_type = \Config::get('campaign.favorite_settings.type');
            if ($favorite_type === "global") {
                $campaigns->orderBy('favorite', 'desc');
                $sort = strlen($request->input('sort')) ? $request->input('sort', 'updated_at') : 'updated_at';
                if ($sort == 'campaign_name') {
                    $sort = 'lower_campaign_name';
                }
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
                    if ($sort == 'campaign_name') {
                        $sort = 'lower_campaign_name';
                    }
                    if (!strlen($request->input('direction')) ||  $request->input('direction') == 'asc') {
                        $campaigns_array = $campaigns_array->sortBy($sort);
                    } else {
                        $campaigns_array = $campaigns_array->sortByDesc($sort);
                    };
                }
            }
        }

        $libraries = [];
        foreach (Auth::user()->getLibraries() as $library) {
            $libraries[$library['_id']] = $library['name'];
        }

        if (isset($campaigns_array)) {
            $result = [];
            $x = ($current_page == 1 ) ? 1 : 0;
            foreach ($campaigns_array as $key => $value) {
                if ($x >= $from && $x <= $to && isset($libraries[(string) $value->library])) {
                    $value->library_name = $libraries[(string) $value->library];
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
            $result = $campaigns->paginate(self::RESULTS_X_PAGE, self::$campaign_fields);
            foreach ($result as $key => $campaign) {
                if (isset($libraries[(string) $campaign->library])) {
                    $result[$key]->library_name = $libraries[(string) $campaign->library];
                }
            }
            return $result;
        }
    }

    /**
     * Get a list of options to show in the "Create a new email" button in the dashboard
     */
    public function getMenu()
    {
        $menu = [];

        $campaign_format = config('view.campaign_format');

        switch ($campaign_format) {
            case 'languages':
                $menu = $this->getMenuByLanguages();
                break;
            case 'libraries':
                $menu = $this->getMenuByLibraries();
                break;
        }

        return $menu;
    }

    /**
     * Get a list of options according to languages
     */
    protected function getMenuByLanguages()
    {
        $menu = [];
        $languages = config('locale.langs');
        foreach ($languages as $language_key => $language) {
            $menu[] = [
                'title' => $language['name'],
                'key' => $language['key'],
                'type' => 'item',
                'link' => '/campaign/edit?locale=' . $language_key
            ];
        }
        return $menu;
    }

    /**
     * Get a list of options according to libraries
     */
    protected function getMenuByLibraries()
    {
        $menu = [];
        $libraries = Auth::user()->getLibraries();
        if (count($libraries)) {
            $campaign_menu = Setting::where('key', '=', 'campaign_menu')->first();
            if ($campaign_menu) {
                $campaign_menu = $campaign_menu->toArray();
                $menu = $this->getMenuBySettings($campaign_menu['value']);
            } else {
                foreach ($libraries as $library_key => $library) {
                    $menu[] = [
                        'title' => $library['name'],
                        'key' => $library['key'],
                        'type' => 'item',
                        'link' => '/campaign/edit?locale=en_us&library=' . $library['_id']
                    ];
                }
            }
        }

        return $menu;
    }

    /**
     * Get a list of options according to a predefined menu in settings
     */
    protected function getMenuBySettings($campaign_menu)
    {
        $menu = [];

        if (count($campaign_menu)) {
            foreach ($campaign_menu as $item) {
                if ($item['type'] === 'item') {
                    $library = Library::where('key', '=', $item['key'])->first();
                    if ($library && Auth::user()->can('access_library_' . $item['key'])) {
                        $menu[] = [
                            'title' => isset($item['title']) ? $item['title'] : $library->name,
                            'key' => $item['key'],
                            'type' => 'item',
                            'link' => '/campaign/edit?locale=en_us&library=' . $library['_id']
                        ];
                    }
                } elseif ($item['type'] === 'submenu') {
                    $submenu = $this->getMenuBySettings($item['items']);
                    if (count($submenu)) {
                        $menu[] = [
                            'title' => $item['title'],
                            'type' => 'submenu',
                            'items' => $submenu
                        ];
                    }
                }
            }
        }

        return $menu;
    }
}
