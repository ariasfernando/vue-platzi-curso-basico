<?php
namespace Stensul\Services;

use Activity;
use MongoDB\BSON\ObjectID as ObjectID;
use Stensul\Models\Tag;
use CampaignModel;
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
     * Get a list of tags
     * @return [type] [description]
     */
    public static function getTagList()
    {
        $tags = [];

        if (config('campaign.search_settings.show_popular_tags', false)) {
            foreach (self::getPopularTags() as $tag) {
                $tags[] = [
                    'label' => $tag,
                    'category' => 'Popular tags'
                ];
            }

            foreach (self::getTagNames() as $tag) {
                $tags[] = [
                    'label' => $tag,
                    'category' => 'Tags'
                ];
            }
        } else {
            $tags = self::getTagNames();
        }

        return $tags;
    }

    /**
     * Get all available tags as an array of names
     *
     * @return array
     */
    public static function getTagNames()
    {
        $tags = [];
        // Get tags from campaigns, so we won't show tags related to only deleted campaigns
        $campaign_tags = CampaignModel::raw(function ($collection) {
            return $collection->aggregate([
                ['$match' => ['status' => ['$ne' => 2]]], // ignore deleted campaigns
                ['$unwind' => '$tags'],
                ['$group' => ['_id' => '$tags']],
                ['$sort' => ['_id' => 1]]
            ]);
        });

        $campaign_tags = Tag::hydrate($campaign_tags->toArray())->toArray();

        if (count($campaign_tags)) {
            $tags = array_column($campaign_tags, '_id');
        }

        return $tags;
    }

    /**
     * Get a list of popular tags used in campaign
     *
     * @return array
     */
    public static function getPopularTags()
    {
        $tags = CampaignModel::raw(function ($collection) {
            return $collection->aggregate([
                ['$match' => ['status' => ['$ne' => 2]]], // ignore deleted campaigns
                ['$unwind' => '$tags'],
                ['$group' => ['_id' => '$tags', 'ids' => ['$addToSet' => '$_id']]],
                ['$project' => ['count' => ['$size' => '$ids']]]
            ]);
        });
        $tags = Tag::hydrate($tags->toArray())->toArray();

        if (count($tags)) {
            // Sort
            usort($tags, function ($a, $b) {
                return $b['count'] - $a['count'];
            });
            // Limit result
            $tags = array_slice($tags, 0, config('campaign.search_settings.number_of_popular_tags', 5));
            // Get only tags
            $tags = array_column($tags, '_id');
        }
        return $tags;
    }
}
