<?php

namespace Stensul\Providers;

use Auth;
use View;
use UserModel as User;
use Illuminate\Support\ServiceProvider;
use Stensul\Providers\ModuleServiceProvider;

class ComposerServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     */
    public function boot()
    {
        // Share to all views
        View::composer(
            '*',
            function ($view) {
                $user_data = [];
                if (Auth::check()) {
                    $user_data = Auth::User();
                }

                $app_config = \Config::all();

                $app_config['modules'] = ModuleServiceProvider::getModuleList();

                $config_array = [
                    "modules"   => $app_config['modules'],
                    "locale"    => $app_config['locale'],
                    "view"      => $app_config['view'],
                    "auth"      => $app_config['auth'],
                    "campaign"  => $app_config['campaign'],
                    "app_name"  => $app_config['app']['name'],
                    "api"       => $app_config['api'],
                    "app_mail_address"  => $app_config['mail']['from']["address"],
                ];

                if (env("APP_ADMIN", false)) {
                    $config_array["admin"] =  $app_config["admin"];
                }

                $view->with('app_config', $config_array);
                $view->with('current_user', $user_data);
                View::share('view_name', $view->getName());
            }
        );

        // Add users to use them as reviewers only when the modal is loaded
        View::composer('*.proof.modal_proof_table', function ($view) {
            $users = [];
            $data = User::where('email', '!=', Auth::user()->email)->get();
            if (count($data)) {
                foreach ($data as $user) {
                    if ($user->can('access_proof')) {
                        $users[] = $user->email;
                    }
                }
            }
            $view->with('proof_users', $users);
        });
    }

    /**
     * Register.
     */
    public function register()
    {
        //
    }
}
