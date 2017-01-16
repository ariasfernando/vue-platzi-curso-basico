<?php

namespace Stensul\Services\Api\Transformers;

/*
|--------------------------------------------------------------------------------------------
| ImageTransformer class
|--------------------------------------------------------------------------------------------
|
| This class create an image model equal for all the image api sources, to unify responses
|
*/

class ImageTransformer
{
    public $image_small = '';
    public $image_large = '';
    public $text = '';
    public $sub_text = '';
    public $likes = null;
    public $source = '';
    public $created_time = null;
    public $link;
    public $user;


    /**
     * Transform the data into a image object response
     *
     * @return Array
     */
    public function transform()
    {
        return [
            "source" => $this->source,
            "text" => $this->text,
            "sub_text" => $this->sub_text,
            "likes" => (!is_null($this->likes))? (int) $this->likes : null,
            "created_time" => $this->created_time,
            "link" => $this->link,
            "user" => $this->user,
            "images" => [
                "small" => ($this->image_small != '')?
                    explode("?", $this->image_small)[0] : $this->image_large,
                "large" => explode("?", $this->image_large)[0]
            ],
        ];
    }
}
