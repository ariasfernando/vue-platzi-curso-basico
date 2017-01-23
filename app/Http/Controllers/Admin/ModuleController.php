<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;
use Stensul\Console\Commands\Module\Create;

class ModuleController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Module administrator Controller
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
     * Show the module admin view.
     *
     * @return View
     */
    public function getIndex(Request $request)
    {
        $modules = \StensulModule::getModuleList();

        return $this->renderView('base.admin.modules', array('modules' => $modules));
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
