<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;
use Stensul\Providers\ModuleServiceProvider;

class Library extends Eloquent
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'libraries';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'modules', 'config'];

    /**
     * Get the library modules
     *
     * @return array Modules
     */
    public function getModules()
    {
        
        $modules = ModuleServiceProvider::getModuleList();
        $library_modules = [];

        foreach ($this->modules as $module) {
            if (isset($modules[$module])) {
                $library_modules[$module] = $modules[$module];
            }
        }
        return $library_modules;
    }
}
