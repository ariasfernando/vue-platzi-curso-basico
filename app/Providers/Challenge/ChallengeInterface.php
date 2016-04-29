<?php

namespace Stensul\Providers\Challenge;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Challenge interface
|--------------------------------------------------------------------------
|
| This interface have the mandatory structure to implement new Challenge provides, add new methods on demand.
|
*/

interface ChallengeInterface
{
    /**
     * Check if challenge is valid.
     *
     * @param Request $request
     *
     * @return boolean
     */
    public function isValid(Request $request);
}
