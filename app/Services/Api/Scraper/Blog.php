<?php

namespace Stensul\Services\Api\Scraper;

use Auth;
use Cache;
use Activity;
use Carbon\Carbon;
use Stensul\Services\Api\Scraper;
use Stensul\Services\Api\ApiImageConnector;
use Stensul\Services\Api\Transformers\ImageTransformer;
use MongoDB\BSON\ObjectID as ObjectID;

class Blog extends Scraper implements ApiImageConnector
{
    private $url;
    private $link_container_id;
    private $link_class;
    private $pagination_link;
    private $pagination_count;
    private $full_image_src;
    private $small_image_src;
    private $text_src;
    private $link_src;
    private $subtext_src;
    private $created_time;
    private $scraper_name;
    private $process_type;
    private $pagination_current = 0;
    private $urls_processed = [];
    private $response_array = [];
    private $flush_cache = false;
    private $only_update = false;
    private $current_page;
    private $limit;

    /**
     * Scraper constructor.
     *
     */
    public function __construct($options = [])
    {
        $this->url                  = $options['url'] ?? null;
        $this->link_container_id    = $options['link_container_id'] ?? '';
        $this->link_class           = $options['link_class'] ?? '';
        $this->pagination_link      = $options['pagination_link'] ?? '';
        $this->pagination_count     = (int) ($options['pagination_count'] ?? 1);
        $this->full_image_src       = $options['full_image_src'] ?? null;
        $this->small_image_src      = $options['small_image_src'] ?? $this->full_image_src;
        $this->text_src             = $options['text_src'] ?? '';
        $this->link_src             = $options['link_src'] ?? '';
        $this->subtext_src          = $options['subtext_src'] ?? '';
        $this->created_time         = $options['created_time'] ?? '';
        $this->scraper_name         = $options['name'] ?? 'scraper-blog';
        $this->process_type         = $options['process_type'] ?? 'meta';
        $this->flush_cache          = isset($options['flush_cache']);
        $this->only_update          = (boolean) ($options['only_update'] ?? false);
        $this->current_page         = (int) ($options['page'] ?? 1);
        $this->limit                = (int) ($options['limit'] ?? 0);
    }

    /**
     * Scraper meta tags from pages
     *
     * @param string $url
     *
     * @return Array $this->response_array
     */
    protected function scraperFromMeta($url = null)
    {
        $source = $url ?? ($this->pagination_link ?? $this->url);

        if ((!is_null($url) || !is_null($this->url)) &&
            filter_var($source, FILTER_VALIDATE_URL) &&
            !in_array($source, $this->urls_processed)) {
            $page_content = $this->call([ "path" => sprintf(urldecode($source), $this->pagination_current) ]);

            if ($page_content !== false) {
                $dom_obj = new \DOMDocument();
                @$dom_obj->loadHTML(mb_convert_encoding($page_content, 'HTML-ENTITIES', 'UTF-8'));

                if (is_null($url)) {
                    $finder = new \DomXPath($dom_obj);
                    $container = strlen($this->link_container_id) ? "//*[@id='$this->link_container_id']" : '';
                    $nodes = $finder->query("$container//a[contains(@class, '$this->link_class')]");

                    if ($nodes->length != 0) {
                        $cached = [];
                        if ($this->only_update) {
                            $cache_key = $this->getCacheKey();
                            if (Cache::has($cache_key)) {
                                $cached = Cache::get($cache_key);
                                array_pop($cached);
                            }
                        }
                        foreach ($nodes as $link) {
                            $scraper = true;
                            if ($this->only_update) {
                                foreach ($cached as $value) {
                                    if (isset($value['link']) && $value['link'] == $link->getAttribute('href')) {
                                        $this->response_array[] = $value;
                                        $scraper = false;
                                    }
                                }
                            }
                            if ($scraper) {
                                $this->scraperFromMeta($link->getAttribute('href'));
                            }
                        }
                    }
                } else {
                    $meta_array = [];
                    foreach ($dom_obj->getElementsByTagName('meta') as $meta) {
                        $attribute = strlen($meta->getAttribute('property'))
                            ? $meta->getAttribute('property')
                            : $meta->getAttribute('name');
                        switch ($attribute) {
                            case $this->full_image_src:
                                if (!isset($meta_array["image_large"])) {
                                    $meta_array["image_large"] = $meta->getAttribute('content');
                                }
                                break;
                            case $this->small_image_src:
                                if (!isset($meta_array["image_small"])) {
                                    $meta_array["image_small"] = $meta->getAttribute('content');
                                }
                                break;
                            case $this->text_src:
                                $meta_array["text"] = $meta->getAttribute('content');
                                break;
                            case $this->subtext_src:
                                $meta_array["sub_text"] = $meta->getAttribute('content');
                                break;
                            case $this->link_src:
                                $meta_array["link"] = $meta->getAttribute('content');
                                break;
                            case $this->created_time:
                                $meta_array["created_time"] = $meta->getAttribute('content');
                                break;
                        }
                    }
                    $this->response_array[] = $meta_array;
                    $this->urls_processed[] = $source;
                }
            }
        }

        return $this->response_array;
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
            if (isset($item['images'])) {
                $transformer->image_small = $item['images']['small'];
                $transformer->image_large = $item['images']['large'];
            } else {
                $transformer->image_small = $item['image_small'] ?? '';
                $transformer->image_large = $item['image_large'] ?? '';
            }
            $transformer->text = $item['text'] ?? '';
            $transformer->sub_text = $item['sub_text'] ?? '';
            $transformer->created_time = (isset($item['created_time']) && is_numeric($item['created_time'])) ?
                $this->formattedDate($item['created_time']) : $this->formattedDate(strtotime($item['created_time']));
            $transformer->link = $item['link'] ?? '';
            $transformer->likes = $item['likes'] ?? 0;
            $transformer->source = !is_null($this->scraper_name) ? $this->scraper_name : $this->url;

            $data_processed[] =  $transformer->transform();
            unset($transformer);
        }

        return $data_processed;
    }

    /**
     * Get public images from public blog
     *
     * @return Array
     */
    public function getPublicImages()
    {
        $response_array = [];
        if (!is_null($this->url)) {
            $cache_key = $this->getCacheKey();
            if (Cache::has($cache_key) && !$this->flush_cache) {
                $response_array = Cache::get($cache_key);
            } else {
                while ($this->pagination_current < $this->pagination_count) {
                    $this->pagination_current++;
                    if ($this->process_type == "meta") {
                        $response_array = $this->imageTransform($this->scraperFromMeta());
                    }
                }

                $current_time = $this->formattedDate();
                $response_array[] = [ 'last_updated' => $current_time ];
                Cache::forget($cache_key);
                Cache::add($cache_key, $response_array, Carbon::now()->addMonth(1));

                Activity::log(
                    'Api images request [scraper]',
                    [
                        'properties' => [
                            'url' => $this->url,
                            'user_id' => new ObjectId(Auth::id())
                        ]
                    ]
                );
            }
        }

        $meta_global = array_pop($response_array);
        $total =  count($response_array);
        $total_pages = ($this->limit > 0) ? (int) ceil($total / $this->limit) : 1;

        return [
            'meta' => [
                'total'            => $total,
                'current_page'     => $this->current_page,
                'total_pages'      => $total_pages,
                'limit'            => $this->limit,
                'last_updated'     => $meta_global['last_updated'] ?? time()
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
        return 'api:scraper:blog:' . $this->scraper_name;
    }
}
