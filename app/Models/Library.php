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

        foreach ($this->modules as $mods) {
            // Modules are grouped.
            if (isset($mods['type']) && $mods['type'] == 'sub-menu') {
                $submenu_items = [];
                foreach ($mods['modules'] as $mod) {
                    if (is_object($modules[$mod['moduleId']])) {
                        $mod_tmp = clone($modules[$mod['moduleId']]);
                        $mod_tmp->name = $mod['name'];
                    } else {
                        $mod_tmp = $modules[$mod['moduleId']];
                        $mod_tmp['name'] = $mod['name'];
                    }
                    $submenu_items[] = $mod_tmp;
                }

                $library_modules[] = [
                    'name' => $mods['name'],
                    'sub_menu' => $submenu_items,
                    'level' => 'level-1'
                ];
            } else { // Ungrouped modules.
                if (is_object($modules[$mods['moduleId']])) {
                    $mod_tmp = clone($modules[$mods['moduleId']]);
                    $mod_tmp->name = $mods['name'];
                } else {
                    $mod_tmp = $modules[$mods['moduleId']];
                    $mod_tmp['name'] = $mods['name'];
                }
                $library_modules[] = $mod_tmp;
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
        foreach ($this->modules as $key => $mods) {
            // Grouped modules.
            if ($mods['type'] == 'sub-menu') {
                $sub_modules_to_keep = [];
                foreach ($mods['modules'] as $mod) {
                    if ($mod['moduleId'] !== $module_key) {
                       $sub_modules_to_keep[] = $mod; 
                    }
                }
                if(!empty($sub_modules_to_keep)) {
                    $mods['modules'] = $sub_modules_to_keep;
                    $modules_to_keep[] = $mods;
                }
            } else { // Ungrouped modules.
                if ($mods['moduleId'] !== $module_key) {
                    $modules_to_keep[] = $mods;
                }
            }
        }

        $this->modules = $modules_to_keep;
    }
}
