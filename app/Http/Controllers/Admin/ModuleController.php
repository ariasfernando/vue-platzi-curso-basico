<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;

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
    public function getList(Request $request)
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
        $modules = \StensulModule::getModule();

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
        // TODO: edit method
    }

    /**
     * Module post create.
     *
     * @return Boolean
     */
    public function postCreate(Request $request)
    {
        $params = [
            "titile" => $request->input("module_title"),
            "description" => $request->input("module_id"),
            "module" => $request->input("module") ?: []
        ];

        return \StensulModule::create($params);
    }
}
