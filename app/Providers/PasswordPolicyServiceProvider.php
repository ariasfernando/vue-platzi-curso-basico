<?php

namespace Stensul\Providers;

use Carbon\Carbon;
use Stensul\Models\User;
use ZxcvbnPhp\Zxcvbn as ZxcvbnPhp;
use Illuminate\Support\ServiceProvider;
use Olssonm\Zxcvbn\ZxcvbnServiceProvider;
use Hackzilla\PasswordGenerator\Generator\ComputerPasswordGenerator;

class PasswordPolicyServiceProvider extends ZxcvbnServiceProvider
{
    /**
     * Check if a user should update their password
     * @param  Stensul\Models\User $user
     * @return boolean
     */
    public static function should_update_password(User $user)
    {
        $password_policy = \Config::get('auth.password_policy');
        if ($password_policy['allow_force_password_reset']
            && isset($user->force_password)
            && $user->force_password == 1
            && env('USER_LOGIN', 'default') != "oauth") {
                return true;
        } elseif ($days = $password_policy['force_update']) {
            if (isset($user->last_password_change)) {
                $date = $user->last_password_change;
            } else {
                $date = $user->created_at;
            }
            $now = Carbon::now();
            if ($date->diff($now)->days > $days) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return a string with the validation rule
     * @param  array  $user_data User data
     * @return string
     */
    public static function password_rule($user_data)
    {
        return 'required|confirmed|min:' . \Config::get('auth.password_policy.min_length')
            . '|max:' . \Config::get('auth.password_policy.max_length')
            . '|zxcvbn_min:' . \Config::get('auth.password_policy.min_score');
    }

    /**
     * Generate a random password
     * @return string
     */
    public static function generate()
    {
        $generator = new ComputerPasswordGenerator();

        $generator
            ->setUppercase()
            ->setLowercase()
            ->setNumbers()
            ->setSymbols(true)
            ->setLength(\Config::get('auth.password_policy.default_length'));

        return $generator->generatePassword();
    }
}