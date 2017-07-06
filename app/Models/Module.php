<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;
use Stensul\Providers\ModuleServiceProvider;

class Module extends Eloquent
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'modules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'key', 'structure', 'status'];



    /**
     * Get the module key standarized
     *
     * @param string $name
     * @return string Module key
     */
    public static function standarizeKey($name)
    {
        return str_replace(' ', '', strtolower($name));
    }
}
