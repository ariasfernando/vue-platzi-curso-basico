<?php
namespace Stensul\Http\Controllers;

use Activity;
use Auth;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class ProxyController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Request URL to proxy.
     *
     * @param \Illuminate\Http\Request $request
     * @throws Symfony\Component\HttpKernel\Exception\BadRequestHttpException
     */
    public function getFetch(Request $request)
    {
        $url = $request->input('url');
        $reject = true;
        $ttl_minutes = 20;

        if ($whitelist = config('proxy.whitelist')) {
            foreach ($whitelist as $element) {
                if ($element['url'] === $url) {
                    $reject = false;
                    $ttl_minutes = $element['ttl'] ?? $ttl_minutes;
                    break;
                }
            }
        }
        if ($reject) {
            abort(403, 'Forbidden');
        }

        $cache_key = sprintf('controllers:campaign:getfetch_%s', sha1($url));
        if ($response = \Cache::get($cache_key)) {
            return $response;
        }

        $client = new Client();
        $params['headers'] = ['Accept-Encoding' => 'gzip'];

        try {
            $response = $client->request('GET', $url, $params);
            $contents = $response->getBody()->getContents();
            \Cache::put($cache_key, $contents, $ttl_minutes);
            return $contents;
        } catch (\GuzzleHttp\Exception\ClientException $exception) {
            // 4xx errors
            abort($exception->getCode(), $exception->getMessage());
        } catch (\Exception $exception) {
            // 500 and log on other errors.
            \Log::error(
                sprintf(
                    'Error proxying url; code: %d, message: %s, url: %s',
                    $exception->getCode(),
                    $exception->getMessage(),
                    $url
                )
            );
            abort(500, 'Internal server error');
        }
    }
}
