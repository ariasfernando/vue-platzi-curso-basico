<div id="search" v-if="enabled == 1">
    <div class="input-group">
        <input type="text" class="form-control search-key" placeholder="Search"
            maxlength="30" 
            data-tags='<?php echo htmlentities( json_encode(Tag::getTagNames()), ENT_QUOTES, 'UTF-8' ); ?>'
            v-bind:disabled="!canSearch"
            v-on:keyup.enter="addSearchTerm"
            v-on:keyup.tab="addSearchTerm"
            v-model="search">
        <span class="input-group-btn">
            <button class="btn btn-default search" type="button" v-on:click.stop.prevent="addSearchTerm"
                ><i class="glyphicon glyphicon-search"></i></button>
        </span>
    </div>
    <div class="btn-group">
        <button v-for="term in terms" class="btn btn-default btn-xs term" v-on:click="removeSearchTerm(term)">
            @{{ term }} <i class="glyphicon glyphicon-remove"></i>
        </button>
        <button v-for="tag in tags" class="btn btn-default btn-xs tag" v-on:click="removeSearchTag(tag)">
            @{{ tag }} <i class="glyphicon glyphicon-remove"></i>
        </button>
    </div>
</div>