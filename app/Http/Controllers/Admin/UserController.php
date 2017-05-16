<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Activity;
use Stensul\Http\Controllers\Controller as Controller;
use Illuminate\Http\Request;
use Stensul\Models\User;
use Stensul\Models\Role;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Http\Middleware\AdminAuthenticate as AdminAuthenticate;

class UserController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | User administrator Controller
    |--------------------------------------------------------------------------
    |
    | This controller serve a CRUD por the user model
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
            "_id" => "User id",
            "name" => "Name",
            "email" => "Email"
        ];

        if (!is_null($search_type) && !is_null($search_text)) {
            $users = User::where($search_type, $search_operator, $search_text)
                ->orderBy($data_order_field, $data_order_type)->where('status', '!=', 'deleted')->paginate((int) $data_page);
        } else {
            $users = User::orderBy($data_order_field, $data_order_type)->where('status', '!=', 'deleted')->paginate((int) $data_page);
        }

        return [
            'users' => $users,
            'search_fields' => $search_fields,
            'search_query' => $search_query
        ];
    }

    /**
     * Show the user admin view.
     *
     * @return View
     */
    public function getIndex(Request $request)
    {
        return $this->renderView('base.admin.users', $this->queryConstructor($request));
    }

    /**
     * Search user list.
     *
     * @return View
     */
    public function getList(Request $request)
    {
        return $this->renderView('base.admin.partials.user_draw_row', $this->queryConstructor($request));
    }

    /**
     * User create view.
     *
     * @return View
     */
    public function getCreate()
    {

        $roles_data = Role::all(['name'])->toArray();
        $roles_array = [];

        foreach ($roles_data as $role) {
            $roles_array[$role['name']] = $role['name'];
        }

        $params = [
            "title" => "Create User",
            "roles" => $roles_array
        ];

        return $this->renderView('base.admin.modals.user_form', array('params' => $params));
    }

    /**
     * User edit view.
     *
     * @return View
     */
    public function getEdit(Request $request)
    {
        $user_data = User::findOrFail($request->input("userId"))->toArray();

        $roles_data = Role::all(['name'])->toArray();

        foreach ($roles_data as $role) {
            $roles_array[$role['name']] = $role['name'];
        }

        $params = [
            "title" => "Edit User",
            "roles" => $roles_array,
            "user" => $user_data
        ];

        return $this->renderView('base.admin.modals.user_form', array('params' => $params));
    }

    /**
     * User post edit.
     *
     * @return array
     */
    public function postEdit(Request $request)
    {
        $user = User::findOrFail($request->input("userId"));
        $user->name = $request->input("name");
        $user->last_name = $request->input("last_name");
        $user->roles = (!is_null($request->input("roles")))? $request->input("roles") : [];

        if ($request->input("password")) {
            $user->password = bcrypt($request->input("password"));
        }

        return ['status' => (int)$user->save()];
    }

    /**
     * User post create.
     *
     * @return array
     */
    public function postCreate(Request $request)
    {
        $roles = (!is_null($request->input("roles")))? $request->input("roles") : [];
        $status = \Artisan::call('user:create', [
            '--name' => $request->input("name"),
            '--lastname' => $request->input("last_name"),
            '--email' => $request->input("email"),
            '--roles' => join(",", $roles)
        ]);
        return [
            'status' => $status,
            'message' => \Artisan::output()
        ];
    }

    /**
     * User post delete.
     *
     * @return array
     */
    public function postDelete(Request $request)
    {
        $user = User::findOrFail($request->input("userId"));
        $user->status = "deleted";
        $user->save();
        $user->delete();
        Activity::log('User deleted', array('properties' => ['user_id' => new ObjectId($request->input("userId"))]));
        return array("deleted" => $request->input("userId"));
    }
}
