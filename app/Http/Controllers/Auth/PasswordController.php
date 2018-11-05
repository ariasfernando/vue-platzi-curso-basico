<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Mail;
use Activity;
use Challenge;
use Carbon\Carbon;
use PasswordPolicy;
use UserModel as User;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Guard;
use Stensul\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Foundation\Auth\ResetsPasswords;
use MongoDB\BSON\ObjectID;
use Stensul\Http\Requests\PasswordChangeRequest;

class PasswordController extends Controller
{

    protected $redirect_to = '/';

    use ResetsPasswords;

    /**
     * Constructor.
     *
     * @param Guard $auth
     * @param PasswordBroker $passwords
     */
    public function __construct(Guard $auth, PasswordBroker $passwords)
    {
        $this->auth = $auth;
        $this->passwords = $passwords;
        $this->subject = env('MAIL_FORGOT_SUBJECT', 'stensul Password Reset Link');
        $this->middleware(
            'Authenticate',
            [
                'except' => [
                    'getEmail',
                    'postEmail',
                    'getReset',
                    'postReset',
                    'getChange',
                    'postChange'
                ]
            ]
        );
    }

    /**
     * Get email view.
     *
     * @return \Illuminate\View\View
     */
    public function getEmail()
    {
        if (\Config::get('challenge.enabled')) {
            $challenge_provider = \Config::get('challenge.default');
            $config = \Config::get('challenge.providers.' . $challenge_provider);
            return view('auth.password')
                    ->with('challenge_key', $config['key'])
                    ->with('challenge_provider', $challenge_provider);
        }
        return view('auth.password');
    }

    /**
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function postEmail(Request $request)
    {
        // Challenge validation
        if (!Challenge::provider()->isValid($request)) {
            Activity::log('User login fail [ERROR_CAPTCHA]');
            return redirect()->back()->withErrors(['status' => 'Please confirm you are not a robot.']);
        }

        $this->validate($request, ['email' => 'required|email']);

        $data_params = $request->only('email');
        $data_params["email"] = strtolower($data_params["email"]);

        $user_auth = User::where('email', '=', $data_params["email"])->first();

        if (is_null($user_auth['status']) || $user_auth['status'] != "deleted") {
            $this->passwords->sendResetLink($data_params, function ($message) {
                $message->subject($this->getEmailSubject());
            });
        }

        return redirect()->back()->with('status', trans(PasswordBroker::RESET_LINK_SENT));
    }

    /**
     * Display the password reset view for the given token.
     *
     * @param  string $token
     * @return Response
     */
    public function getReset($token = null)
    {
        if (is_null($token)) {
            throw new NotFoundHttpException;
        }

        return view('auth.reset')->with('token', $token);
    }

    /**
     * Reset the given user's password.
     *
     * @param  Request $request
     * @return Response
     */
    public function postReset(Request $request)
    {
        $request->merge(['email' => strtolower($request->get("email"))]);

        $user = User::whereEmail($request->get("email"))->first();

        $this->validate($request, [
            'token' => 'required',
            'email' => 'required|email',
            'password' => PasswordPolicy::password_rule($user)
        ]);

        $credentials = $request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        );

        $response = $this->passwords->reset(
            $credentials,
            function ($user, $password) {

                $user->password = bcrypt($password);
                $user->last_password_change = Carbon::now();
                $user->force_password = 0;
                $user->unconfirmed = 0;

                $user->save();
            }
        );

        switch ($response) {
            // Don't tip off attackers if the user exists or not.
            case PasswordBroker::INVALID_USER:
            case PasswordBroker::PASSWORD_RESET:
                Activity::log('User restored', array('properties' => ['user_id' => new ObjectID($user->_id)]));
                return redirect('auth/login')->with('message', 'SUCCESS_CHANGE');

            default:
                return redirect()->back()
                    ->withInput($request->only('email'))
                    ->withErrors(['email' => trans($response)]);
        }
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function getChange()
    {
        return view('auth.change_password');
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function postChange(PasswordChangeRequest $request)
    {

        if (!Auth::check()) {
            return redirect('auth/login')->with('message', 'ERROR_CHANGE');
        }

        $user_data = Auth::user();
        $inputs = $request->all();

        if (Auth::validate(['email' => $user_data->email, 'password' => $inputs['old_password']])) {
            $user_data->password = bcrypt($inputs['password']);
            $user_data->force_password = 0;
            $user_data->last_password_change = Carbon::now();
            $user_data->save();
            Auth::logout();
            return redirect('auth/login')->with('message', 'SUCCESS_CHANGE');
        } else {
            return redirect()->back()->withErrors(['error' => "The password is incorrect."]);
        }
    }
}
