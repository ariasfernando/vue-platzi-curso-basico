<?php

namespace Stensul\Http\Controllers;

use Auth;
use Stensul\Models\Campaign;

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
    }

    /**
     * Show the application dashboard to the user.
     *
     * @return View
     */
    public function index()
    {

        $user_visibility = Auth::user()->getLibraries();

        if (count($user_visibility) === 0) {
            $campaigns_edited = Campaign::where('processed', '=', 0, 'AND')
                ->where('status', '!=', 2)
                ->orderBy('updated_at', 'desc')->paginate(5);

            $campaigns_processed = Campaign::where('processed', '=', 1, 'AND')
                ->where('status', '!=', 2)
                ->orderBy('updated_at', 'desc')
                ->paginate(5);
        } else {
            $campaigns_edited = Campaign::where('processed', '=', 0, 'AND')
                ->where('status', '!=', 2)
                ->whereIn('library', $user_visibility)
                ->orderBy('updated_at', 'desc')
                ->paginate(5);

            $campaigns_processed = Campaign::where('processed', '=', 1, 'AND')
                ->where('status', '!=', 2)
                ->whereIn('library', $user_visibility)
                ->orderBy('updated_at', 'desc')
                ->paginate(5);
        }

        $params = [
            'locales' => \Config::get('locales'),
            'campaigns_edited' => $campaigns_edited,
            'campaigns_processed' => $campaigns_processed,
        ];

        return $this->renderView('base.dashboard', array('params' => $params));
    }
}
