<?php

use Illuminate\Database\Migrations\Migration;
use Stensul\Models\Role;
use Stensul\Models\User;

class AssignStudioRoleToStensulUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $users = User::where('roles', 'all', ['admin', 'stensul-internal'])->get();

        if (Role::where('name', 'studio-master')->first()) {
            foreach ($users as $user) {
                if (!in_array('studio-master', $user->roles)) {
                    $user->roles = array_merge($user->roles, ['studio-master']);
                    $user->save();
                }
            }
        } elseif (Role::where('name', 'studio-admin')->first()) {
            foreach ($users as $user) {
                if (!in_array('studio-admin', $user->roles)) {
                    $user->roles = array_merge($user->roles, ['studio-admin']);
                    $user->save();
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
