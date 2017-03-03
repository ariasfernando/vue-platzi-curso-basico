<?php

namespace Stensul\Http\Requests;

use Auth;
use PasswordPolicy;

class PasswordChangeRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'old_password' => 'required',
            'password' => PasswordPolicy::password_rule(Auth::user()) . '|different:old_password',
            'password_confirmation' => 'required|same:password'
        ];
    }
}
