<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Setting extends Eloquent
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'settings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'key', 'value', 'properties'];
}
