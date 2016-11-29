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

        // @TODO Populate module list.
        $params = [
            "title" => "Create Library",
            "modules" => ['module 1', 'module 2', 'module 3']
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

        // @TODO complete with modules from Db.
        $modules = [];
        $params = [
            "title" => "Edit Library",
            "menu_items" => $modules
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
        $library->name = $request->input("name");
        $library->description = $request->input("description");
        $library->modules = (!is_null($request->input("modules")))? $request->input("modules") : [];

        return (int) $library->save();
    }

    /**
     * Library post create.
     *
     * @return Boolean
     */
    public function postCreate(Request $request)
    {
        $modules = (!is_null($request->input("modules")))? $request->input("modules") : [];


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
