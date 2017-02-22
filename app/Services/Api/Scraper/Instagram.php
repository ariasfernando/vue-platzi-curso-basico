<?php

namespace Stensul\Services\Api\Scraper;

use Auth;
use Cache;
use Activity;
use Carbon\Carbon;
use Stensul\Services\Api\Scraper;
use Stensul\Services\Api\ApiImageConnector;
use Stensul\Services\Api\Transformers\ImageTransformer;

class Instagram extends Scraper implements ApiImageConnector
{

    private $instagram_url = "https://instagram.com/";
    private $url;
    private $user_name;
    private $scraper_name;
    private $response_array = [];
    private $flush_cache = false;
    private $current_page;
    private $limit;

    /**
     * Scraper constructor.
     */
    public function __construct($options = [])
    {
        $this->user_name = (isset($options['user_name']))? $options["user_name"] : '';
        $this->url = $this->instagram_url . $this->user_name;
        $this->scraper_name = (isset($options['name']))? $options['name'] : 'scraper-instagram';
        $this->flush_cache = (isset($options["flush_cache"]));
        $this->current_page = (isset($options["page"]))? (int)$options["page"] : 1;
        $this->limit = (isset($options["limit"]))? (int)$options["limit"] : 0;
    }

    /**
     * Transform the response data usign the image transformer
     *
     * @param Array $data
     *
     * @return Array
     */
    public function imageTransform($items = [])
    {
        $data_processed = [];

        foreach ($items as $item) {
            $transformer = new ImageTransformer();
            $transformer->image_small = (isset($item['image_small']))? $item['image_small'] : '';
            $transformer->image_large = (isset($item['image_large']))? $item['image_large'] : '';
            $transformer->text = (isset($item['text']))? $item['text'] : '';
            $transformer->created_time = (isset($item['created_time']) && is_numeric($item['created_time']))?
                $this->formattedDate($item['created_time']) : $this->formattedDate(strtotime($item['created_time']));
            $transformer->link = (isset($item['link']))? $item['link'] : '';
            $transformer->likes = (isset($item['likes']))? $item['likes'] : 0;
            $transformer->source = (!is_null($this->scraper_name))? $this->scraper_name : $this->url;

            $data_processed[] =  $transformer->transform();
            unset($transformer);
        }

        return $data_processed;
    }

    /**
     * Get public images from public blog
     *
     * @param Array $options
     *
     * @return Array
     */
    public function getPublicImages()
    {
        $response_array = [];
        if (!is_null($this->user_name)) {
            $cache_key = $this->getCacheKey();

            if (Cache::has($cache_key) && !$this->flush_cache) {
                $response_array = Cache::get($cache_key);
            } else {
                $page_content = $this->call(["path" => $this->url ]);

                preg_match("/window\._sharedData ?= (.*)<\/script>/Uis", $page_content, $match);
                $response_call = trim(preg_replace("/;$/", "", trim($match[1])));
                $response_call = trim(preg_replace("/\n/", "", trim($response_call)));
                $response_parse = json_decode($response_call);

                if (isset($response_parse->entry_data->ProfilePage[0]->user) &&
                    isset($response_parse->entry_data->ProfilePage[0]->user->media)) {
                    if (isset($response_parse->entry_data->ProfilePage[0]->user->media->nodes)) {
                        foreach ($response_parse->entry_data->ProfilePage[0]->user->media->nodes as $item) {
                            $item_array = [
                                "link" => $this->instagram_url . "p/" . $item->code,
                                "likes" => $item->likes->count,
                                "created_time" => $item->date,
                                "text" => $item->caption,
                                "image_small" => $item->thumbnail_src,
                                "image_large" => $item->thumbnail_src
                            ];

                            $this->response_array[] = $item_array;
                        }
                    }
                }

                $response_array = $this->imageTransform($this->response_array);
                $current_time = $this->formattedDate();
                $response_array[] = [ 'last_updated' => $current_time ];
                Cache::forget($cache_key);
                Cache::add($cache_key, $response_array, Carbon::now()->addMonth(1));

                Activity::log(
                    'Api images request [scraper]',
                    [
                        'properties' => [
                            'url' => $this->url,
                            'user_id' => new \MongoId(Auth::id())
                        ]
                    ]
                );
            }
        }

        $meta_global = array_pop($response_array);
        $total =  count($response_array);
        $total_pages = ($this->limit > 0)? (int)ceil($total / $this->limit) : 1;

        return [
            'meta' => [
                'total'           => $total,
                'current_page'    => $this->current_page,
                'total_pages'     => $total_pages,
                'limit'           => $this->limit,
                'last_updated'    => (isset($meta_global['last_updated']))?
                    $meta_global['last_updated'] : time()
            ],
            'data' => $this->paginationConstructor($response_array, $this->current_page, $this->limit)
        ];
    }

    /**
     * Return a cache key
     *
     * @return String
     */
    public function getCacheKey()
    {
        return 'api:scraper:instagram:' . $this->user_name;
    }
}
