<?php

namespace Stensul\Providers;

use Carbon\Carbon;
use Stensul\Models\User;
use ZxcvbnPhp\Zxcvbn as ZxcvbnPhp;
use Illuminate\Support\ServiceProvider;
use Olssonm\Zxcvbn\ZxcvbnServiceProvider;
use Hackzilla\PasswordGenerator\Generator\RequirementPasswordGenerator;

class PasswordPolicyServiceProvider extends ZxcvbnServiceProvider
{
    /**
     * Check if a user should update their password
     * @codingStandardsIgnoreStart  (ignore method name not in camelCase, required by Laravel)
     * @param  Stensul\Models\User $user
     * @return boolean
     */
    public static function should_update_password(User $user)
    {
        // @codingStandardsIgnoreEnd

        // Skip the policy if the login method is not default
        if (env('USER_LOGIN', 'default') != "default") {
            return false;
        }
        $password_policy = \Config::get('auth.password_policy');
        if ($password_policy['allow_force_password_reset']
            && isset($user->force_password)
            && $user->force_password == 1) {
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
     * @codingStandardsIgnoreStart (ignore method name not in camelCase, required by Laravel)
     * @SuppressWarnings("UnusedFormalParameter")
     * @param  array  $user_data User data
     * @return string
     */
    public static function password_rule($user_data)
    {
        // @codingStandardsIgnoreEnd
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
        $generator = new RequirementPasswordGenerator();


        $generator
            ->setLength(\Config::get('auth.password_policy.default_length'))
            ->setOptionValue(RequirementPasswordGenerator::OPTION_UPPER_CASE, true)
            ->setOptionValue(RequirementPasswordGenerator::OPTION_LOWER_CASE, true)
            ->setOptionValue(RequirementPasswordGenerator::OPTION_NUMBERS, true)
            ->setOptionValue(RequirementPasswordGenerator::OPTION_SYMBOLS, true)

            ->setMinimumCount(RequirementPasswordGenerator::OPTION_UPPER_CASE, 2)
            ->setMinimumCount(RequirementPasswordGenerator::OPTION_LOWER_CASE, 2)
            ->setMinimumCount(RequirementPasswordGenerator::OPTION_NUMBERS, 2)
            ->setMinimumCount(RequirementPasswordGenerator::OPTION_SYMBOLS, 2)

            ->setMaximumCount(RequirementPasswordGenerator::OPTION_UPPER_CASE, 8)
            ->setMaximumCount(RequirementPasswordGenerator::OPTION_LOWER_CASE, 8)
            ->setMaximumCount(RequirementPasswordGenerator::OPTION_NUMBERS, 8)
            ->setMaximumCount(RequirementPasswordGenerator::OPTION_SYMBOLS, 2)

            ->setParameter(RequirementPasswordGenerator::PARAMETER_SYMBOLS, '!@$*/()[]-=');

        return $generator->generatePassword();
    }
}
