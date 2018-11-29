<?php

namespace Stensul\Http\Controllers\Admin;

use Auth;
use Activity;
use DB;
use Stensul\Http\Controllers\Controller;
use Illuminate\Http\Request;
use LibraryModel as Library;
use PermissionModel as Permission;
use RoleModel as Role;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Http\Middleware\AdminAuthenticate;
use ModelKeyManager;
use Validator;
use Illuminate\Validation\Rule;

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
        $this->middleware('acl.permission:access_admin_libraries');
        $this->middleware('acl.permission:access_admin_studio_libraries');
    }

    /**
     * Build the query to search.
     *
     * @return array
     */
    protected function queryConstructor($request)
    {
        $search_type = $request->input('type') ? $request->input("type") : null;
        $search_text = $request->input('q') ? '%' . trim($request->input("q")) . '%' : null;
        $search_in   = $request->input('search_in') ? $request->input("search_in") : null;

        $data_order_field = $request->input('order_field') ?: 'created_at';
        $data_order_type = $request->input('order_type') ?: 'DESC';
        $data_page = $request->input('limit') ?: config('admin.sections.libraries.limit_per_page', 10);
        $search_operator = 'like';
        $search_query = count($request->all()) ? $request->all() : [];

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
        } elseif ($search_in) {
            $libraries = Library::whereIn('_id', $search_in)->orderBy($data_order_field, $data_order_type)->paginate((int) $data_page);
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
        return $this->renderView('admin.libraries', $this->queryConstructor($request));
    }

    /**
     * Search library list.
     *
     * @return View
     */
    public function getList(Request $request)
    {
        return $this->renderView('admin.partials.library_draw_row', $this->queryConstructor($request));
    }

    /**
     * Search library list.
     *
     * @return array
     */
    public function postList(Request $request)
    {
        $libraries = Auth::User()->getLibraries();

        $request['search_in'] = array_map(function ($library) {
            return $library['_id'];
        }, $libraries);

        if (!count($request['search_in'])) {
            $request['search_in'] = [false];
        }

        $result = $this->queryConstructor($request);

        return $result['libraries'];
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

        return $this->renderView('admin.modals.library_form', array('params' => $params));
    }

    /**
     * Library edit view.
     *
     * @return View
     */
    public function getEdit(Request $request)
    {
        $library_data = Library::findOrFail($request->input("libraryId"))->toArray();
        $modules = array_keys(\StensulModule::getModuleList('publish'));

        $params = [
            "title" => "Edit Library",
            "modules" => $modules,
            "library" => $library_data
        ];

        return $params;
    }

    /**
     * Library post edit.
     *
     * @return boolean
     */
    public function postEdit(Request $request)
    {
        $request->validate(
            [
                'name' => ['required', 'max:255', $this->libraryUniqueValidator($request->input('libraryId'))],
                'config.trackingConfig' => 'json|required_if:config.tracking,==,true'
            ],
            [
                'config.trackingConfig.json'        => 'Tracking configuration must be a valid JSON.',
                'config.trackingConfig.required_if' => 'Tracking configuration is required if tracking is enabled.'
            ]
        );

        $library              = Library::findOrFail($request->input("libraryId"));
        $old_name             = $library->name;
        $library->name        = $request->input("name");
        $library->description = $request->input("description");
        $library->modules     = $modules = [];
        $library->config      = $request->input("config");
        $library->modules     = $request->input('modules');

        if (is_null($library->config)) {
            return array("message" => "ERROR_CONFIG");
        }

        if ($library->config === '') {
            $library->config = null;
        }

        $library->save();
        
        if ($library->name !== $old_name) {
            // Update library name in campaigns for library name search
            // We do not use directly the Campaign model class to avoid touching the updated_at attribute
            DB::table('campaigns')->where('library', new ObjectID($library->id))->update(['library_name' => $library->name]);
        }

        return array("message" => "SUCCESS");
    }

    /**
     * Library post create.
     * @throws \Illuminate\Validation\ValidationException
     * @return Boolean
     */
    public function postCreate(Request $request)
    {

        $request->validate(
            [
                'name' => ['required', 'max:255', $this->libraryUniqueValidator($request->input('libraryId'))],
                'config.trackingConfig' => 'json|required_if:config.tracking,==,true'
            ],
            [
                'config.trackingConfig.json'        => 'Tracking configuration must be a valid JSON.',
                'config.trackingConfig.required_if' => 'Tracking configuration is required if tracking is enabled.'
            ]
        );

        $params = [
            "name"        => $request->input("name"),
            "key"         => ModelKeyManager::getStandardKey(new Library, $request->input('name')),
            "description" => $request->input("description"),
            "config"      => $request->input("config"),
            "modules"     => $request->input('modules')
        ];

        // Create permission to have access to the new library
        $permission_params = [
            "name"        => "access_library_" . $params['key'],
            "description" => "Access to library: " . $params['name']
        ];

        if (Permission::where('name', '=', $permission_params["name"])->exists()) {
            $response_message = array("message"=> "ERROR_EXISTS");
        } else {
            Library::create($params);
            Permission::create($permission_params);

            // Add newly created permission to admin role.
            if ($role = Role::where('name', '=', 'admin')->first()) {
                $permissions = $role->permissions;
                $permissions[] = $permission_params['name'];
                $role->permissions = $permissions;
                $role->save();
            }

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

        Permission::where('name', '=', 'access_library_' . $library->key)->delete();

        Activity::log(
            'Library and permissions deleted',
            array('properties' => ['library_id' => new ObjectID($library->id)])
        );

        return array("deleted" => $request->input("libraryId"));
    }

    /**
     * Library ESP providers.
     *
     * @return array
     */
    public function postEspProviders()
    {
        $providers = config('esp');
        return $providers;
    }

    private function libraryUniqueValidator($id) {
        $uniqueValidator = Rule::unique('libraries', 'name')->where(function ($query) {
            return $query->where('deleted_at', null);
        });

        if ($id) {
            $uniqueValidator = Rule::unique('libraries', 'name')->where(function ($query) {
                return $query->where('deleted_at', null);
            })->ignore($id, '_id');
        }
        
        return $uniqueValidator;
    }
}
