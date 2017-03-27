<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use Stensul\Models\Library;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;
use Stensul\Console\Commands\Module\Create;

class StudioController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Studio Controller
    |--------------------------------------------------------------------------
    |
    | This controller serve a CRUD por the module model
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
     * Show the module admin view.
     *
     * @return View
     */
    public function getIndex(Request $request)
    {
        $modules = \StensulModule::getModuleList();

        return $this->renderView('base.admin.studio', array(
            'modules' => $modules,
            'libraries' => $this->queryConstructor($request)
        ));
    }

    /**
     * Get module list.
     *
     * @return View
     */
    public function getList()
    {
        $modules = \StensulModule::getModuleList();

        return $this->renderView('base.admin.partials.module_draw_row', array('modules' => $modules));
    }

    /**
     * Get modules.
     *
     * @return array Modules data
     */
    public function getModules()
    {
        return \StensulModule::getModuleList();
    }

    /**
     * Module create view.
     *
     * @return View
     */
    public function getCreate()
    {
        $modules = array_keys(\StensulModule::getModuleList());
        $params = [
            "title" => "Create Module",
            "modules" => array_combine($modules, $modules)
        ];

        return $this->renderView('base.admin.modals.module_form', array('params' => $params));
    }

    /**
     * Module edit view.
     *
     * @return View
     */
    public function getEdit(Request $request)
    {
        $module_id = $request->input('module_id');

        $module_data = \StensulModule::getModule($module_id);
        $module_data['config'] = $module_data;
        $module_data['template'] = \StensulModule::getTemplate($module_id);
        $params = [
            "title" => "Edit Module",
            "module" => $module_data
        ];

        return $this->renderView('base.admin.modals.module_form', array('params' => $params));
    }

    /**
     * Module post edit.
     *
     * @return boolean
     */
    public function postEdit(Request $request)
    {
        $params = [
            'name' => $request->input('module_title'),
            'module_id' => $request->input('module_id'),
            'description' => $request->input('module_description'),
            'config' => $request->input('module_config') ?: [],
            'template' => $request->input('module_template') ?: '',
            'parent_module' => 'none'
        ];
        
        $exit_code = \StensulModule::edit($params);

        return $this->getExitMessage($exit_code);
    }

    /**
     * Module post create.
     *
     * @return Boolean
     */
    public function postCreate(Request $request)
    {
        $params = [
            'name' => $request->input('module_title'),
            'module_id' => $request->input('module_id'),
            'description' => $request->input('module_description'),
            'config' => $request->input('module_config') ?: [],
            'parent_module' => $request->input('parent_module')
        ];

        $exit_code = \StensulModule::create($params);

        return $this->getExitMessage($exit_code);
    }

    /**
     * Get message from exit code.
     *
     * @return string
     */
    public function getExitMessage($exit_code)
    {
        $message = '';
        switch ($exit_code) {
            case 0:
                $message = array('message' => 'SUCCESS');
                break;
            case \StensulModule::ERROR_INVALID_MODULE_ID:
                $message = array('message' => 'ERROR_INVALID_MODULE_ID');
                break;
            case \StensulModule::ERROR_CREATING_MODULE_DIR:
                $message = array('message' => 'ERROR_CREATING_MODULE_DIR');
                break;
            case \StensulModule::ERROR_CONFIG_FILE:
                $message = array('message' => 'ERROR_CONFIG_FILE');
                break;
            case \StensulModule::ERROR_TEMPLATE_FILE:
                $message = array('message' => 'ERROR_TEMPLATE_FILE');
                break;
            case \StensulModule::ERROR_PARENT_TEMPLATE:
                $message = array('message' => 'ERROR_PARENT_TEMPLATE');
                break;
            case \StensulModule::ERROR_DUPLICATE_MODULE_ID:
                $message = array('message' => 'ERROR_DUPLICATE_MODULE_ID');
                break;
            case \StensulModule::ERROR_INVALID_JSON:
                $message = array('message' => 'ERROR_INVALID_JSON');
                break;
            case \StensulModule::ERROR_DELETING_TEMPLATE:
                $message = array('message' => 'ERROR_DELETING_TEMPLATE');
                break;
        }
        return $message;
    }
}
