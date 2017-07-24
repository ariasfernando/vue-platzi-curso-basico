<?php

namespace Stensul\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;
use Stensul\Providers\ModuleServiceProvider;

class Library extends Eloquent
{

    use SoftDeletes;

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
                    'name' => preg_replace(["/^modules-/", "/_/"], ['', ' '], $group),
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
     * Remove a module from the library menu.
     * Call save() after using this method to persist the changes.
     *
     * @param string $module_key
     */
    public function removeModule($module_key)
    {

        $modules_to_keep = [];

        // Recreate the modules array without the removed module.
        foreach ($this->modules as $group => $mods) {
            // Grouped modules.
            if (is_array($mods)) {
                foreach ($mods as $mod) {
                    if ($mod !== $module_key) {
                        $modules_to_keep[$group][] = $mod;
                    }
                }
            } else { // Ungrouped modules.
                if ($mods !== $module_key) {
                    $modules_to_keep[] = $mods;
                }
            }
        }

        $this->modules = $modules_to_keep;
    }
}
