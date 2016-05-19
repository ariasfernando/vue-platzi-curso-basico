<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use Stensul\Models\Log;
use Stensul\Http\Controllers\Auth\AdminAuthController as AdminAuth;

class LogController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Log administrator Controller
    |--------------------------------------------------------------------------
    |
    | This controller serve a CRUD por the log model
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('admin');
    }

    /**
     * Build the query to search.
     *
     * @return array
     */
    protected function queryConstructor($request)
    {
        $search_type = ($request->input('type'))? $request->input("type") : null;
        $search_text = ($request->input('q'))? '%'.trim($request->input("q")).'%' : null;
        $data_order_field = ($request->input('order_field')) ?: 'updated_at';
        $data_order_type = ($request->input('order_type')) ?: 'DESC';
        $data_page = $request->input('limit') ?: 5;
        $search_operator = 'like';
        $search_query = (count($request->all()))? $request->all() : [];

        if (strpos($search_type, '_id') !== false && \MongoId::isValid(trim($request->input("q")))) {
            $search_text = new \MongoId(trim($request->input("q")));
            $search_operator = '=';
        }

        $search_fields = [
            "" => "Search for ...",
            "description" => "Description",
            "properties.user_id" => "User id",
            "properties.campaign_id" => "Campaign id",
            "ip" => "IP",
            "user_agent" => "User agent",
            "controller" => "Controller",
            "action" => "Action"
        ];

        if (!is_null($search_type) && !is_null($search_text)) {
            $logs = Log::where($search_type, $search_operator, $search_text)
                ->orderBy($data_order_field, $data_order_type)->paginate((int) $data_page);
        } else {
            $logs = Log::orderBy($data_order_field, $data_order_type)->paginate((int) $data_page);
        }

        return [
            'logs' => $logs,
            'search_fields' => $search_fields,
            'search_query' => $search_query
        ];
    }

    /**
     * Show the log admin view.
     *
     * @return View
     */
    public function getIndex(Request $request)
    {
        return $this->renderView('base.admin.logs', $this->queryConstructor($request));
    }

    /**
     * Search log list.
     *
     * @return View
     */
    public function getList(Request $request)
    {
        return $this->renderView('base.admin.partials.logs_draw_row', $this->queryConstructor($request));
    }
}
