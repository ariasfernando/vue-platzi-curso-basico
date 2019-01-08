<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Imagine;
use Activity;
use Stensul\Http\Controllers\Controller;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectID as ObjectID;
use MongoDB\Driver\Exception\BulkWriteException;
use Stensul\Http\Middleware\AdminAuthenticate;
use ModuleModel as Module;
use LibraryModel as Library;
use ModelKeyManager;
use Validator;
use Illuminate\Validation\Rule;

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
        $this->middleware('acl.permission:access_admin_modules');
        $this->middleware('acl.permission:access_admin_studio_modules');
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
     * @param Request $request
     * @param string $type Module type, null, "custom", "studio"
     * @return array Modules data
     */
    public function getModules(Request $request, $type = null)
    {
        return \StensulModule::getModuleList(null, $type);
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
     * @throws \Illuminate\Validation\ValidationException
     * @return array [id => moduleId, message => ERROR|SUCCESS]
     */
    public function postSave(Request $request)
    {

        $request->validate([
            'name' => ['required', 'max:255', $this->moduleUniqueValidator($request->input('moduleId'))],
            'description' => ['max:255'],
            'structure' => 'required',
            'plugins' => 'required',
            'status' => ['required', Rule::in(['draft', 'publish'])],
        ]);

        $params = [
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'structure' => $request->input('structure'),
            'plugins' => $request->input('plugins'),
            'status' => $request->input('status', 'draft'),
            'type' => 'studio'
        ];

        $user = new \stdClass();
        $user->id = new ObjectID(Auth::user()->id);
        $user->email = Auth::user()->email;

        //If the module has id we are editing it, if not, we are creating it
        if ($request->input("moduleId")) {
            $module = Module::findOrFail($request->input("moduleId"));
            $module->updated_by = $user;
            $log_title = 'Module updated';
        } else {
            $module = new Module;
            $module->key = ModelKeyManager::getStandardKey($module, $request->input('name'));
            $module->created_by = $user;
            $log_title = 'Module created';
        }

        foreach ($params as $key => $value) {
            $module->$key = $value;
        }

        try {
            $module->save();

            Activity::log(
                $log_title,
                [
                    'properties' => [
                        'module_id' => new ObjectID($module->id),
                        'module_name' => $module->name,
                        'module_status' => $module->status,
                    ]
                ]
            );

            return [
                'id' => $module->id,
                'message' => 'SUCCESS'
            ];
        } catch (BulkWriteException $exception) {
            if (preg_match("/^E11000 duplicate key/", $exception->getMessage())) {
                return response()->json([
                    'message' => 'ERROR_EXISTS',
                ], 409);
            } else {
                throw $exception;
            }
        }
    }

    /**
     * Module post delete.
     *
     * Delete a module and remove it from libraries that use it.
     *
     * @param Request $request
     * @return array [deleted => moduleId]
     */
    public function postDelete(Request $request)
    {

        $module = Module::findOrFail($request->input("moduleId"));
        $module->delete();

        $libraries = Library::all();
        if (count($libraries)) {
            foreach ($libraries as $library) {
                $library->removeModule($module->key);
                $library->save();
            }
        }

        Activity::log(
            'Module deleted',
            [
                'properties' => [
                    'module_id' => new ObjectID($module->id),
                    'module_name' => $module->name,
                ]
            ]
        );

        return ["deleted" => $request->input("moduleId")];
    }
    /**
     * Upload Image to the Module.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function postUploadImage(Request $request)
    {
        $image = new Imagine;
        return $image->saveImage($request->input('data_image'), 'local:modules:studio');
    }

    private function moduleUniqueValidator($id)
    {
        $uniqueValidator = Rule::unique('modules', 'name')->where(function ($query) {
            return $query->where('deleted_at', null);
        });

        if ($id) {
            $uniqueValidator = Rule::unique('modules', 'name')->where(function ($query) {
                return $query->where('deleted_at', null);
            })->ignore($id, '_id');
        }
        
        return $uniqueValidator;
    }
}
