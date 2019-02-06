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
    public $title = '';
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
    public function transform($options = [])
    {
        if (!empty($options['keep_original_image_url']) && $options['keep_original_image_url'] === true) {
            $small = ($this->image_small != '')? $this->image_small : $this->image_large;
            $large = $this->image_large;
        } else {
            $small = ($this->image_small != '')? explode("?", $this->image_small)[0] : $this->image_large;
            $large = explode("?", $this->image_large)[0];
        }

        return [
            "source" => $this->source,
            "title" => !empty($this->title) ? $this->title : $this->text,
            "text" => $this->text,
            "sub_text" => $this->sub_text,
            "likes" => (!is_null($this->likes))? (int) $this->likes : null,
            "created_time" => $this->created_time,
            "link" => $this->link,
            "user" => $this->user,
            "id" => !empty($this->id) ? $this->id : null,
            "images" => [
                "small" => $small,
                "large" => $large
            ],
        ];
    }
}
