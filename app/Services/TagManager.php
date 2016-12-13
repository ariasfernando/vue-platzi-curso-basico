<?php
namespace Stensul\Services;

use Activity;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Models\Tag;
use Stensul\Exceptions\BadParameterException;

class TagManager
{
    /**
     * Create a new tag.
     * @param  array $data
     * @return \Stensul\Models\Tag
     */
    public static function create($data = [])
    {
        if (array_key_exists('name', $data)) {
            $tag = Tag::where('name', $data['name'])->first();
            if (!$tag) {
                $tag = Tag::create($data);
                Activity::log('Tag created', array('properties' => ['tag_id' => new ObjectID($tag->id)]));
            }
            return $tag;
        } else {
            throw new BadParameterException('You must provide a tag name for the new tag');
        }
    }

    /**
     * Get all available tags
     *
     * @return array
     */
    public static function all()
    {
        return Tag::all();
    }

    /**
     * Get all available tags as an array of names
     *
     * @return array
     */
    public static function getTagNames()
    {
        $tags = Tag::all()->keyBy('name')->all();
        return array_keys($tags);
    }
}
