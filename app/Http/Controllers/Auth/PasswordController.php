<?php

namespace Stensul\Http\Controllers\Auth;

use Auth;
use Mail;
use Activity;
use Challenge;
use Stensul\Http\Requests\PasswordChangeRequest;
use Illuminate\Http\Request;
use Stensul\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Foundation\Auth\ResetsPasswords;

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
        $this->middleware('guest', ['except' => [ 'getChange','postChange' ] ]);
    }

    /**
     * Get email view.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function getEmail(Request $request)
    {
        $challenge_provider = \Config::get('challenge.default');
        $config = \Config::get('challenge.providers.' . $challenge_provider);

        return view('base.auth.password')
                ->with('challenge_key', $config['key'])
                ->with('challenge_provider', $challenge_provider);
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
        $challenge_provider = \Config::get('challenge.default');
        $config = \Config::get('challenge.providers.' . $challenge_provider);

        if (!Challenge::provider()->isValid($request)) {
            Activity::log('User login fail [ERROR_CAPTCHA]');
            return redirect()->back()->withErrors(['status' => 'Captcha validation is required']);
        }

        $this->validate($request, ['email' => 'required|email']);

        $data_params = $request->only('email');
        $data_params["email"] = strtolower($data_params["email"]);

        $response = $this->passwords->sendResetLink($data_params, function ($message) {
            $message->subject($this->getEmailSubject());
        });

        switch ($response) {
            case PasswordBroker::RESET_LINK_SENT:
                return redirect()->back()->with('status', trans($response));

            case PasswordBroker::INVALID_USER:
                return redirect()->back()->withErrors(['email' => trans($response)]);
        }
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

        return view('base.auth.reset')->with('token', $token);
    }

    /**
     * Reset the given user's password.
     *
     * @param  Request $request
     * @return Response
     */
    public function postReset(Request $request)
    {

        $request->merge(array('email' => strtolower($request->get("email"))));

        $this->validate(
            $request,
            [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed',
            ]
        );

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

                $user->save();
            }
        );

        switch ($response) {
            case PasswordBroker::PASSWORD_RESET:
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
        return view('base.auth.change_password');
    }

    /**
     * Show register view.
     *
     * @return \Illuminate\View\View
     */
    public function postChange(PasswordChangeRequest $request)
    {
        $user_data = Auth::user();
        $inputs = $request->all();

        if (Auth::validate(['email' => $user_data->email, 'password' => $inputs['old_password']])) {
            $user_data->password = bcrypt($inputs['password']);
            $user_data->force_password = 0;
            $user_data->save();
            Auth::logout();
            return redirect('auth/login')->with('message', 'SUCCESS_CHANGE');
        } else {
            return redirect()->back()->withErrors(['error' => "The password is incorrect."]);
        }
    }
}
