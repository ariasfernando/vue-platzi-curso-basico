<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID as ObjectID;
use MongoDB\Driver\Exception\BulkWriteException;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;
use Stensul\Models\Module;

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
    public function getIndex()
    {
        $modules = \StensulModule::getModuleList();

        return $this->renderView('admin.modules', array('modules' => $modules));
    }

    /**
     * Get module list.
     *
     * @return View
     */
    public function getList()
    {
        $modules = \StensulModule::getModuleList();

        return $this->renderView('admin.partials.module_draw_row', array('modules' => $modules));
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

        return $this->renderView('admin.modals.module_form', array('params' => $params));
    }

    /**
     * Module edit.
     *
     * @param Request $request
     * @return string JSON Encoded module data.
     */
    public function getEdit(Request $request)
    {
        return Module::findOrFail($request->input('moduleId'));
    }

    /**
     * Module post save. Inserts or update a module.
     *
     * @param Request $request
     * @return Boolean
     */
    public function postSave(Request $request)
    {
        $params = [
            'name' => $request->input('name'),
            'key' => Module::standarizeKey($request->input('name')),
            'structure' => $request->input('structure'),
            'status' => $request->input('status', 'draft'),
            'class' => 'studio'
        ];

        if ($request->input("moduleId")) {
            $module = Module::findOrFail($request->input("moduleId"));
        } else {
            $module = new Module;
        }

        foreach ($params as $key => $value) {
            $module->$key = $value;
        }

        try {
            $module->save();

            $response_message = [
                'id' => $module->id,
                'message' => 'SUCCESS'
            ];
        } catch (BulkWriteException $exception) {
            if (preg_match("/^E11000 duplicate key/", $exception->getMessage())) {
                $response_message = ['message' => 'ERROR_EXISTS'];
            } else {
                throw $exception;
            }
        } catch (\Exception $exception) {
            $response_message = ['message' => 'ERROR_SAVING'];
        }

        return $response_message;
    }
}
