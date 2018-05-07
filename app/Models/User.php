<?php

namespace Stensul\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Illuminate\Notifications\Notifiable;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;
use Stensul\Notifications\ResetPasswordNotification;

class User extends Eloquent implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword, SoftDeletes, Notifiable;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'last_name', 'email', 'password', 'force_password', 'avatar_url', 'roles'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['last_password_change', 'deleted_at'];

    protected $defaults = array(
        'name' => '',
        'last_name' => '',
        'email' => '',
        'password' => '',
        'force_password' => 1,
        'avatar_url' => '',
        'roles' => []
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
     * Get Avatar.
     *
     * @param int $size
     *
     * @return string
     */
    public function getAvatar($size = 40)
    {
        return 'https://www.gravatar.com/avatar/'
            . md5(strtolower(trim($this->email)))
            . '?d='.urlencode(url(\Config::get('view.default_avatar_path')))
            . '&d=identicon&r=pg&s='.$size;
    }

    /**
     * Check if user can do some task
     *
     * @param string/array $permissions
     *
     * @return boolean
     */
    public function can($permissions)
    {
        $user_permissions = $this->getPermissions();
        $asked_permissions = (is_array($permissions))? $permissions : [$permissions];
        return (count(array_intersect($asked_permissions, $user_permissions)) > 0);
    }

    /**
     * Check if user can see a library
     *
     * @param string $library
     *
     * @return boolean
     */
    public function see($library)
    {
        $user_library = $this->getLibraries();
        $asked_permissions = (is_array($library))? $library : [$library];
        return (count(array_intersect($asked_permissions, $user_library)) > 0);
    }

    /**
     * Check if user has a role
     *
     * @param string $role
     *
     * @return boolean
     */
    public function hasRole($role)
    {
        return in_array($role, $this->roles);
    }

    /**
     * Get the user roles
     *
     * @return model Roles
     */
    public function getRoles()
    {
        return Role::whereIn('name', $this->roles)->get();
    }

    /**
     * Get the user libraries
     *
     * @return array Libraries
     */
    public function getLibraries()
    {
        $user_visibility = [];
        $libraries = Library::all(['name','key'])->toArray();
        $permissions = $this->getPermissions();

        foreach ($libraries as $library) {
            if (in_array("access_library_" . $library['key'], $permissions)) {
                $user_visibility[] = $library;
            }
        }
        return $user_visibility;
    }

    /**
     * Get the user permissions
     *
     * @return array Permissions
     */
    public function getPermissions()
    {
        $permissions = [];
        foreach ($this->getRoles() as $role_data) {
            $permissions = array_merge($permissions, $role_data->permissions);
        }
        return $permissions;
    }

    /**
    * Send the password reset notification.
    *
    * @param  string  $token
    * @return void
    */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token, $this->name));
    }

    /**
     * Scope a query to only include active users
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'deleted');
    }
}
