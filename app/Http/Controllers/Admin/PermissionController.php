<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Activity;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use Stensul\Models\Role;
use Stensul\Models\Permission;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;
use MongoDB\BSON\ObjectID as ObjectID;

class PermissionController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Permission administrator Controller
    |--------------------------------------------------------------------------
    |
    | This controller serve a CRUD por the permission model
    |
    */

    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('AdminAuthenticate');
        $this->middleware('acl.permission:access_admin_permissions');
    }

    /**
     * Show the permission admin view.
     *
     * @return View
     */
    public function getIndex()
    {
        $data_page = config('admin.sections.permissions.limit_per_page', 10);
        $permissions = Permission::orderBy('updated_at', 'desc')->paginate((int) $data_page);
        return $this->renderView('admin.permissions', array('permissions' => $permissions));
    }

    /**
     * Search permission list.
     *
     * @return View
     */
    public function getList(Request $request)
    {
        $data_page = $request->input('limit') ?: config('admin.sections.permissions.limit_per_page', 10);
        $data_order_field = ($request->input('order_field')) ?: 'updated_at';
        $data_order_type = ($request->input('order_type')) ?: 'DESC';

        $permissions = Permission::orderBy($data_order_field, $data_order_type)
            ->paginate((int) $data_page)
            ->all();

        return $this->renderView(
            'admin.partials.permission_draw_row',
            ['permissions' => $permissions]
        );
    }

    /**
     * Permission create view.
     *
     * @return View
     */
    public function getCreate()
    {
        $params = [
            "title" => "Create Permission"
        ];

        return $this->renderView('admin.modals.permission_form', array('params' => $params));
    }

    /**
     * Permission edit view.
     *
     * @return View
     */
    public function getEdit(Request $request)
    {
        $permission_data = Permission::findOrFail($request->input("permissionId"))->toArray();

        $params = [
            "title" => "Edit Permission",
            "permission" => $permission_data
        ];

        return $this->renderView('admin.modals.permission_form', array('params' => $params));
    }

    /**
     * Permission post edit.
     *
     * @return boolean
     */
    public function postEdit(Request $request)
    {
        $permission = Permission::findOrFail($request->input("permissionId"));
        $permission->description = $request->input("description");
        $permission->save();

        return array("message" => "SUCCESS");
    }

    /**
     * Permission post create.
     *
     * @return Boolean
     */
    public function postCreate(Request $request)
    {
        $params = [
            "name" => $request->input("name"),
            "description" => $request->input("description")
        ];

        if (Permission::where('name', '=', $params["name"])->exists()) {
            $response_message = array("message"=> "ERROR_EXISTS");
        } else {
            Permission::create($params);
            $response_message = array("message"=> "SUCCESS");
        }

        return $response_message;
    }

    /**
     * Permission post delete.
     *
     * @return array
     */
    public function postDelete(Request $request)
    {
        $permission = Permission::findOrFail($request->input("permissionId"));
        $permission->delete();

        Activity::log(
            'Permission deleted',
            array('properties' => ['permission_id' => new ObjectID($permission->id)])
        );

        return array("deleted" => $request->input("permissionId"));
    }
}
