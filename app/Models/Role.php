<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Model as Eloquent;

class Role extends Eloquent
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'roles';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'libraries', 'permissions'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    protected $defaults = array(
        'name' => '',
        'description' => '',
        'libraries' => [],
        'permissions' => [],
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
}
