<?php
namespace Stensul\Services\Api\Scraper;

use Api;
use Cache;
use Config;
use Activity;
use Auth;
use Carbon\Carbon;
use Stensul\Services\Api\Scraper;
use Stensul\Services\Api\ApiImageConnector;
use Stensul\Services\Api\Transformers\ImageTransformer;
use Stensul\ImageProxy\Generator;

/**
 * Scraper for Salesforce Marketing Cloud (formerly ExactTarget).
 */
class MarketingCloud extends Scraper implements ApiImageConnector
{
    private $flush_cache;
    private $limit;
    private $api_url;
    private $current_page;
    private $imageproxy_url;
    private $imageproxy_secret;

    public function __construct($options = [])
    {

        $this->scraper_name = (isset($options['name']) ? $options['name'] : 'scraper-marketing-cloud');
        $this->flush_cache = (isset($options['flush_cache']));
        $this->api_url = Config::get('api.exact_target.base_url');
        $this->current_page = (isset($options['page'])) ? (int) $options['page'] : 1;
        $this->limit = (isset($options['limit'])) ? (int) $options['limit'] : 0;
        $this->imageproxy_url = env('IMAGEPROXY_URL');
        $this->imageproxy_secret = env('IMAGEPROXY_SECRET');
    }

    public function getPublicImages()
    {
        $driver = Api::driver('ExactTarget');
        $client = $driver->getClient();
        $response_array = [];
        $cache_key = $this->getCacheKey();
        if (Cache::has($cache_key) && !$this->flush_cache) {
            $response_array = Cache::get($cache_key);
        } else {
            $resp =  $client->getPortfolioImages($this->api_url);
            $response_array = $this->imageTransform($resp->items);
            $current_time = $this->formattedDate();
            $response_array[] = ['last_updated' => $current_time];
            Cache::forget($cache_key);
            Cache::add($cache_key, $response_array, Carbon::now()->addMonth(1));
            Activity::log(
                'Api images Request [scraper]',
                [
                    'properties' => [
                        'url' => $this->api_url,
                        'user_id' => new \MongoId(Auth::id())
                    ]
                ]
            );
        }
        $meta_global = array_pop($response_array);
        $total = count($response_array);
        $total_pages = ($this->limit > 0) ? (int) ceil($total / $this->limit) : 1;
        return [
            'meta' => [
                'total'        => $total,
                'current_page' => $this->current_page,
                'total_pages'  => $total_pages,
                'limit'        => $this->limit,
                'last_updated' => (isset($meta_global['last_updated'])) ?
                    $meta_global['last_updated'] : time()
            ],
            'data' => $this->paginationConstructor($response_array, $this->current_page, $this->limit)
        ];
    }

    public function imageTransform($data = [])
    {
        $data_processed = [];
        foreach ($data as $item) {
            $transformer = new ImageTransformer();
            $transformer->image_small = $item->thumbURL;
            $proxy = new Generator($this->imageproxy_url, $this->imageproxy_secret);
            $proxy->setImage($item->fileURL)
                ->quality(100);
            $transformer->image_large = $proxy->getUrl();
            $transformer->text = $item->customerKey;
            $transformer->created_time = $this->formattedDate(strtotime($item->createdDate));
            $transformer->link = '';
            $transformer->likes = 0;
            $transformer->source = $this->api_url . 'guide/v1/contentItems/portfolio';
            $data_processed[] = $transformer->transform();
            unset($transformer);
        }
        return $data_processed;
    }

    public function getCacheKey()
    {
        return 'api:scraper:MarketingCloud:' . $this->scraper_name;
    }
}
