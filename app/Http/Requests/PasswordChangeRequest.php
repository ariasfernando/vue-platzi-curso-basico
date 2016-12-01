<?php

namespace Stensul\Http\Requests;

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
            'password' => 'required|min:8|max:16|different:old_password',
            'password_confirmation' => 'required|min:8|max:16|same:password',
        ];
    }
}
