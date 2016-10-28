<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Permission extends Eloquent
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'permissions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    protected $defaults = array(
        'name' => '',
        'description' => ''
    );

    /**
     * Constructor.
     *
     * @param array $attributes
     */
    public function __construct(array $attributes = array())
    {
        $this->setRawAttributes($this->defaults, true);
        parent::__construct($attributes);
    }

    /**
     * Return all roles for the current permission.
     * @return array
     */
    public function inRoles()
    {

        $inRoles = [];
        $roles_permissions = Role::all(['name','permissions'])->toArray();

        foreach ($roles_permissions as $role_permission) {
            if (in_array($this->name, $role_permission['permissions'])) {
                $inRoles[] = $role_permission['name'];
            }
        }

        return $inRoles;
    }
}
