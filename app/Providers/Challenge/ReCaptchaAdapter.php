<?php

namespace Stensul\Providers\Challenge;

use Log;
use ReCaptcha;
use Illuminate\Http\Request;
use Stensul\Providers\Challenge\ReCaptcha\NotVerifiedPeerPost;

class RecaptchaAdapter implements ChallengeInterface
{
    protected $config;

    /**
     * Constructor.
     *
     * @param array $config
     */
    public function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * Validate Challenge - Recaptcha token
     *
     * @param Request $request
     * @return boolean
     */
    public function isValid(Request $request)
    {
        $recaptcha = new ReCaptcha($this->config['secret'], new NotVerifiedPeerPost());
        $resp = $recaptcha->verify($request->input('g-recaptcha-response'), $request->ip());
        
        return $resp->isSuccess();
    }
}
