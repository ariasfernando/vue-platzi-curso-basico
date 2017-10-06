<?php

namespace Stensul\Console\Commands\Task;

use Stensul\Models\Tag;
use Stensul\Models\Campaign;
use Illuminate\Console\Command;

class TagsToLowercase extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'task:tags-to-lowercase';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change campaign tags to lowercase.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $this->info('>>> Update tags in campaigns.');
        $campaigns = Campaign::withTrashed()->get();
        foreach ($campaigns as $campaign) {
            if (isset($campaign->tags) && count($campaign->tags)) {
                $campaign->timestamps = false;
                $old_tags = array_map('strtolower', $campaign->tags);
                $new_tags = array_unique($old_tags);
                $this->info(sprintf('Campaign %s: turn [%s] into [%s]', $campaign->id, implode(', ', $old_tags), implode(', ', $new_tags)));
                $campaign->tags = $new_tags;
                $campaign->save();
            }
        }

        $this->info('>>> Delete repeated tags.');
        $tags = Tag::all();
        foreach ($tags as $tag) {
            if (Tag::whereName(strtolower($tag->name))->whereNotIn('_id', [$tag->id])->count() > 0) {
                $this->info(sprintf('%s tag "%s" already exists in lowercase, delete this', $tag->id, $tag->name));
                $tag->delete();
            } else {
                $this->info(sprintf('%s tag "%s" turn into lowercase', $tag->id, $tag->name));
                $tag->timestamps = false;
                $tag->name = strtolower($tag->name);
                $tag->save();
            }
        }

        $this->info('Done.');
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [];
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [];
    }
}
