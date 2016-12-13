<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use Stensul\Models\Library;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;

class LibraryController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Library administrator Controller
    |--------------------------------------------------------------------------
    |
    | This controller serve a CRUD por the library model
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('AdminAuthenticate');
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
        $data_order_field = ($request->input('order_field')) ?: 'created_at';
        $data_order_type = ($request->input('order_type')) ?: 'DESC';
        $data_page = $request->input('limit') ?: 5;
        $search_operator = 'like';
        $search_query = (count($request->all()))? $request->all() : [];

        if (strpos($search_type, '_id') !== false) {
            try {
                $search_text = new ObjectID(trim($request->input("q")));
                $search_operator = '=';
            } catch (\MongoDB\Driver\Exception\InvalidArgumentException $exception) {
            }
        }

        $search_fields = [
            "" => "Search for ...",
            "_id" => "Library id",
            "name" => "Name"
        ];

        if (!is_null($search_type) && !is_null($search_text)) {
            $libraries = Library::where($search_type, $search_operator, $search_text)
                ->orderBy($data_order_field, $data_order_type)->paginate((int) $data_page);
        } else {
            $libraries = Library::orderBy($data_order_field, $data_order_type)->paginate((int) $data_page);
        }

        return [
            'libraries' => $libraries,
            'search_fields' => $search_fields,
            'search_query' => $search_query
        ];
    }

    /**
     * Show the library admin view.
     *
     * @return View
     */
    public function getIndex(Request $request)
    {
        return $this->renderView('base.admin.libraries', $this->queryConstructor($request));
    }

    /**
     * Search library list.
     *
     * @return View
     */
    public function getList(Request $request)
    {
        return $this->renderView('base.admin.partials.library_draw_row', $this->queryConstructor($request));
    }

    /**
     * Library create view.
     *
     * @return View
     */
    public function getCreate()
    {
        $modules = array_keys(\StensulModule::getModuleList());
        $params = [
            "title" => "Create Library",
            "modules" => array_combine($modules, $modules)
        ];

        return $this->renderView('base.admin.modals.library_form', array('params' => $params));
    }

    /**
     * Library edit view.
     *
     * @return View
     */
    public function getEdit(Request $request)
    {
        $library_data = Library::findOrFail($request->input("libraryId"))->toArray();
        $modules = array_keys(\StensulModule::getModuleList());
        $modules = array_combine($modules, $modules);

        $params = [
            "title" => "Edit Library",
            "modules" => $modules,
            "library" => $library_data
        ];

        return $this->renderView('base.admin.modals.library_form', array('params' => $params));
    }

    /**
     * Library post edit.
     *
     * @return boolean
     */
    public function postEdit(Request $request)
    {
        $library = Library::findOrFail($request->input("libraryId"));
        $library->description = $request->input("description");
        $library->modules = !is_null($request->input("modules")) ? $request->input("modules") : [];
        $library->config = !empty($request->input("config")) ? json_decode($request->input("config")) : '';

        if (is_null($library->config)) {
            return array("message" => "ERROR_CONFIG");
        }

        if ($library->config === '') {
            $library->config = null;
        }
        $library->save();

        return array("message" => "SUCCESS");
    }

    /**
     * Library post create.
     *
     * @return Boolean
     */
    public function postCreate(Request $request)
    {
        $params = [
            "name" => $request->input("name"),
            "description" => $request->input("description"),
            "modules" => $request->input("modules") ?: []
        ];

        if (Library::where('name', '=', $params["name"])->exists()) {
            $response_message = array("message"=> "ERROR_EXISTS");
        } else {
            Library::create($params);
            $response_message = array("message"=> "SUCCESS");
        }

        return $response_message;

    }

    /**
     * Library post delete.
     *
     * @return array
     */
    public function postDelete(Request $request)
    {
        $library = Library::findOrFail($request->input("libraryId"));
        $library->delete();
        return array("deleted" => $request->input("libraryId"));
    }
}