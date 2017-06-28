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
    protected $fillable = ['name', 'key', 'description', 'modules', 'config'];

    /**
     * Get the library modules
     *
     * @return array Modules
     */
    public function getModules()
    {

        $modules = ModuleServiceProvider::getModuleList();
        $library_modules = [];

        foreach ($this->modules as $group => $mods) {
            // Modules are grouped.
            if (is_array($modules) && is_array($mods)) {
                $submenu_items = [];
                foreach ($mods as $mod) {
                    if (isset($modules[$mod])) {
                        if ($group !== 'modules-default') {
                            $submenu_items[] = $modules[$mod];
                        } else {
                            $library_modules[] = $modules[$mod];
                        }
                    }
                }

                $library_modules[] = [
                    'title' => preg_replace(["/^modules-/", "/_/"], ['', ' '], $group),
                    'sub_menu' => $submenu_items,
                    'level' => 'level-1'
                ];
            } else { // Ungrouped modules.
                if (isset($modules[$mods])) {
                    $library_modules[] = $modules[$mods];
                }
            }
        }
        return $library_modules;
    }

    /**
     * Get the library key standarized
     *
     * @param string $name
     * @return string Modules
     */
    public static function standarizeKey($name)
    {
        return str_replace(' ', '', strtolower($name));
    }
}
