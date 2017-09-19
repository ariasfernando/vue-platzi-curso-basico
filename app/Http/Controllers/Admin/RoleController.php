<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Activity;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use Stensul\Models\Role;
use Stensul\Models\Permission;
use Stensul\Http\Controllers\Auth\AdminAuthController as AdminAuth;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;
use MongoDB\BSON\ObjectID as ObjectID;

class RoleController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Role administrator Controller
    |--------------------------------------------------------------------------
    |
    | This controller serve a CRUD por the role model
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('AdminAuthenticate');
        $this->middleware('acl.permission:access_admin_roles');
    }

    /**
     * Show the role admin view.
     *
     * @return View
     */
    public function getIndex()
    {
        $data_page = config('admin.sections.roles.limit_per_page',10);
        $roles_data = Role::orderBy('updated_at', 'desc')->paginate((int) $data_page);
        return $this->renderView('admin.roles', array('roles' => $roles_data));
    }

    /**
     * Search role list.
     *
     * @return View
     */
    public function getList(Request $request)
    {
        $data_page = $request->input('limit') ?: config('admin.sections.roles.limit_per_page',10);
        $data_order_field = ($request->input('order_field')) ?: 'updated_at';
        $data_order_type = ($request->input('order_type')) ?: 'DESC';


        $roles = Role::orderBy($data_order_field, $data_order_type)
            ->paginate((int) $data_page)
            ->all();

        return $this->renderView(
            'admin.partials.role_draw_row',
            ['roles' => $roles]
        );
    }

    /**
     * Get model data
     *
     * @return array
     */
    private function getModelData()
    {
        $libraries_data = array_keys(\Config::get("view.libraries"));
        $permissions_data = Permission::all(['name'])->toArray();
        $permissions_array = [];
        $libraries_array = [];

        foreach ($libraries_data as $library) {
            if ($library != "default") {
                $libraries_array[$library] = $library;
            }
        }

        foreach ($permissions_data as $permission) {
            $permissions_array[$permission['name']] = $permission['name'];
        }

        return [
            "permissions" => $permissions_array,
            "libraries" => $libraries_array,
        ];
    }

    /**
     * Role create view.
     *
     * @return View
     */
    public function getCreate()
    {
        $modelData = $this->getModelData();
        $params = [
            "title" => "Create Role",
            "permissions" => $modelData["permissions"],
            "libraries" => $modelData["libraries"]
        ];
        return $this->renderView('admin.modals.role_form', array('params' => $params));
    }

    /**
     * Role edit view.
     *
     * @return View
     */
    public function getEdit(Request $request)
    {
        $role_data = Role::findOrFail($request->input("roleId"))->toArray();
        $modelData = $this->getModelData();
        $params = [
            "title" => "Edit Role",
            "permissions" => $modelData["permissions"],
            "role" => $role_data
        ];

        return $this->renderView('admin.modals.role_form', array('params' => $params));
    }

    /**
     * Role post edit.
     *
     * @return boolean
     */
    public function postEdit(Request $request)
    {
        $role_data = Role::findOrFail($request->input("roleId"));
        $role_data->description = $request->input("description");
        $role_data->permissions = (is_null($request->input("permissions")))? [] : $request->input("permissions");

        $role_data->save();
        return array("message"=> "SUCCESS");
    }

    /**
     * Role post create.
     *
     * @return Boolean
     */
    public function postCreate(Request $request)
    {
        $params = [
        "name" => $request->input("name"),
        "description" => $request->input("description"),
        "permissions" => (!is_null($request->input("permissions")))? $request->input("permissions") : [],
        "libraries" => (is_null($request->input("libraries"))
            || $request->input("libraries") == "default" )? [] : $request->input("libraries")
        ];

        if (Role::where('name', '=', $params["name"])->exists()) {
            $response_message = array("message"=> "ERROR_EXISTS");
        } else {
            Role::create($params);
            $response_message = array("message"=> "SUCCESS");
        }

        return $response_message;
    }

    /**
     * Role post delete.
     *
     * @return array
     */
    public function postDelete(Request $request)
    {
        $role = Role::findOrFail($request->input("roleId"));
        $role->delete();

        Activity::log(
            'Role deleted',
            array('properties' => ['role_id' => new ObjectID($role->id)])
        );

        return array("deleted" => $request->input("roleId"));
    }
}
